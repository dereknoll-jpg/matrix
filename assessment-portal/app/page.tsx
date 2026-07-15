"use client";

import { useMemo, useState } from "react";
import {
  categories,
  quizQuestions,
  techs,
  type AssessmentAnswers,
  type QuizAnswers,
  type SubmissionResult,
  validateComplete,
} from "../lib/assessment";

type StoredSubmission = {
  id: number;
  techName: string;
  overall: number;
  level: string;
  scores: SubmissionResult;
  updatedAt: string;
};

const ratingLabels = [
  "Not yet",
  "Basic awareness",
  "Can handle routine work",
  "Independent",
  "Advanced / coaches others",
  "Expert / sets standards",
];

function scoreClass(score: number) {
  if (score >= 3.75) return "score strong";
  if (score >= 3) return "score steady";
  if (score >= 2) return "score watch";
  return "score risk";
}

function shortDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function Home() {
  const [mode, setMode] = useState<"assessment" | "matrix">("assessment");
  const [assessmentPasscode, setAssessmentPasscode] = useState("");
  const [activeTech, setActiveTech] = useState("");
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [quiz, setQuiz] = useState<QuizAnswers>({});
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [matrixUnlocked, setMatrixUnlocked] = useState(false);
  const [assessmentLocked, setAssessmentLocked] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<SubmissionResult | null>(null);

  const completion = useMemo(() => validateComplete(answers, quiz), [answers, quiz]);
  const totalItems = categories.reduce((sum, category) => sum + category.statements.length, 0) + quizQuestions.length;
  const completedItems = Object.keys(answers).filter((key) => answers[key]).length + Object.keys(quiz).length;
  const percentDone = Math.round((completedItems / totalItems) * 100);
  const averageOverall = submissions.length
    ? Math.round((submissions.reduce((sum, item) => sum + item.overall, 0) / submissions.length) * 10) / 10
    : 0;

  const categoryAverages = categories.map((category) => {
    const scores = submissions
      .map((submission) => submission.scores.categoryScores.find((score) => score.key === category.key)?.score ?? 0)
      .filter(Boolean);
    const average = scores.length ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10 : 0;
    const lead = submissions
      .map((submission) => ({
        techName: submission.techName,
        score: submission.scores.categoryScores.find((item) => item.key === category.key)?.score ?? 0,
      }))
      .sort((a, b) => b.score - a.score)[0];

    return {
      ...category,
      average,
      lead,
      risk: average >= 3.75 ? "Healthy" : average >= 3 ? "Watch" : average > 0 ? "Gap" : "No data",
    };
  });

  const biggestGap = [...categoryAverages].filter((item) => item.average > 0).sort((a, b) => a.average - b.average)[0];
  const submittedTechs = submissions.filter((submission) => submission.scores?.categoryScores?.length);
  const categoryReports = categories.map((category) => {
    const scoredTechs = submittedTechs
      .map((submission) => ({
        techName: submission.techName,
        score: submission.scores.categoryScores.find((score) => score.key === category.key)?.score ?? 0,
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
    const average = categoryAverages.find((item) => item.key === category.key)?.average ?? 0;
    const leads = scoredTechs.filter((item) => item.score >= 4).slice(0, 3);
    const candidates = [...scoredTechs].filter((item) => item.score < 4).sort((a, b) => a.score - b.score).slice(0, 3);
    const readyCount = scoredTechs.filter((item) => item.score >= 4).length;
    const watchCount = scoredTechs.filter((item) => item.score >= 3.5 && item.score < 4).length;
    const focusCount = scoredTechs.filter((item) => item.score < 3.5).length;
    const priority = average ? Math.round(((5 - average) + candidates.length * 0.18 + (readyCount < 2 ? 0.35 : 0)) * 100) / 100 : 0;

    return {
      ...category,
      average,
      leads,
      candidates,
      readyCount,
      watchCount,
      focusCount,
      priority,
      recommendation: candidates.length
        ? `Pair ${candidates.map((item) => item.techName.split(" ")[0]).join(", ")} with ${leads[0]?.techName ?? "a category lead"}.`
        : readyCount >= 2
          ? "Maintain coverage with rotation and knowledge sharing."
          : "Build at least two dependable backups for this area.",
    };
  });
  const submittedCategoryReports = categoryReports.filter((category) => category.average > 0);
  const strongestCategory = [...submittedCategoryReports].sort((a, b) => b.average - a.average)[0];
  const weakestCategory = [...submittedCategoryReports].sort((a, b) => a.average - b.average)[0];
  const gapPriorities = [...submittedCategoryReports].sort((a, b) => b.priority - a.priority).slice(0, 5);
  const mostBalanced = submittedTechs
    .map((submission) => {
      const scores = submission.scores.categoryScores.map((category) => category.score);
      return {
        techName: submission.techName,
        range: scores.length ? Math.round((Math.max(...scores) - Math.min(...scores)) * 10) / 10 : 0,
        overall: submission.overall,
      };
    })
    .sort((a, b) => a.range - b.range || b.overall - a.overall)[0];
  const topSpecialist = submittedTechs
    .flatMap((submission) =>
      submission.scores.categoryScores.map((category) => ({
        techName: submission.techName,
        category: category.label,
        score: category.score,
      }))
    )
    .sort((a, b) => b.score - a.score)[0];
  const scorecards = submittedTechs
    .map((submission) => {
      const sortedScores = [...submission.scores.categoryScores].sort((a, b) => b.score - a.score);
      const primaryGap = sortedScores[sortedScores.length - 1];
      const gapLead = categoryReports.find((category) => category.key === primaryGap?.key)?.leads[0];
      return {
        submission,
        sortedScores,
        primaryGap,
        goal: primaryGap
          ? `Next goal: strengthen ${categories.find((category) => category.key === primaryGap.key)?.shortLabel ?? primaryGap.label} through shadowing, ticket review, and one documented win.`
          : "Next goal: maintain balanced readiness.",
        pairing: primaryGap && gapLead ? `Suggested pairing: ${gapLead.techName}` : "Suggested pairing: rotate with a category lead.",
      };
    })
    .sort((a, b) => b.submission.overall - a.submission.overall);
  const calibrationNotes = submittedTechs
    .map((submission) => {
      const variances = submission.scores.categoryScores
        .filter((category) => category.quizPercent !== null)
        .map((category) => {
          const quizScore = ((category.quizPercent ?? 0) / 100) * 5;
          return {
            label: categories.find((item) => item.key === category.key)?.shortLabel ?? category.label,
            variance: Math.round((quizScore - category.selfAverage) * 10) / 10,
          };
        })
        .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
      const strongestVariance = variances[0];
      return {
        techName: submission.techName,
        note: strongestVariance
          ? strongestVariance.variance >= 0.5
            ? `${strongestVariance.label}: quiz outpaced self-rating by ${strongestVariance.variance.toFixed(1)}. Confidence-building opportunity.`
            : strongestVariance.variance <= -0.5
              ? `${strongestVariance.label}: self-rating led quiz by ${Math.abs(strongestVariance.variance).toFixed(1)}. Coaching/checklist opportunity.`
              : "Self-rating and quiz performance are closely aligned."
          : "Not enough quiz data for calibration.",
      };
    });
  const canViewMatrix = activeTech === "Derek Noll";
  const heroKicker = mode === "assessment" ? "Assessment" : "Team matrix";
  const heroTitle = mode === "assessment" ? "Field Services North Assessment" : "Field Services North Matrix";
  const heroSubtitle =
    mode === "assessment"
      ? activeTech
        ? `${activeTech}, complete each section carefully. Your submission is final once recorded.`
        : "Enter your assigned passcode to begin."
      : "Manager view for team readiness, strengths, and coverage.";

  async function unlockAssessment() {
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "assessment", passcode: assessmentPasscode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Invalid technician passcode.");

      setActiveTech(data.techName);
      setAnswers({});
      setQuiz({});
      setLastResult(null);
      setAssessmentLocked(false);

      const resultResponse = await fetch("/api/my-result", {
        cache: "no-store",
        headers: { "x-tech-passcode": assessmentPasscode },
      });
      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error(resultData.error ?? "Could not check prior result.");

      if (resultData.submission) {
        setLastResult(resultData.submission.scores);
        setAssessmentLocked(true);
        setStatus(`Welcome back, ${data.techName}. Your assessment has already been submitted.`);
      } else {
        setStatus(`Assessment unlocked for ${data.techName}.`);
      }
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "Could not unlock assessment.");
    }
  }

  async function unlockDerekMatrix() {
    setError("");
    setStatus("");

    if (!canViewMatrix) {
      setError("Team matrix access is restricted.");
      return;
    }

    const loaded = await loadSubmissions({ techPasscode: assessmentPasscode });
    if (loaded) {
      setMatrixUnlocked(true);
      setMode("matrix");
      setStatus("Team matrix unlocked.");
    }
  }

  async function loadSubmissions(access: { adminPasscode?: string; techPasscode?: string } = {}) {
    try {
      const headers: Record<string, string> = {};
      if (access.techPasscode) headers["x-tech-passcode"] = access.techPasscode;
      else if (access.adminPasscode) headers["x-admin-passcode"] = access.adminPasscode;

      const response = await fetch("/api/submissions", {
        cache: "no-store",
        headers,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load submissions.");
      setSubmissions(data.submissions ?? []);
      return true;
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load submissions.");
      return false;
    }
  }

  async function submitAssessment() {
    setError("");
    setStatus("");

    if (!activeTech) {
      setError("Enter your assigned passcode before submitting.");
      return;
    }
    if (!completion.complete) {
      setError("Please complete every self-assessment statement and quiz question before submitting.");
      return;
    }

    setStatus("Saving assessment...");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techPasscode: assessmentPasscode, answers, quiz }),
      });
      const data = await response.json();
      if (response.status === 409 && data.submission?.scores) {
        setLastResult(data.submission.scores);
        setAssessmentLocked(true);
        throw new Error(data.error ?? "Assessment already submitted.");
      }
      if (!response.ok) throw new Error(data.error ?? "Could not save assessment.");

      setLastResult(data.submission);
      setAssessmentLocked(true);
      setStatus("Assessment saved. Thank you — your score is now included for the manager matrix.");
      if (matrixUnlocked && canViewMatrix) await loadSubmissions({ techPasscode: assessmentPasscode });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save assessment.");
      setStatus("");
    }
  }

  if (!activeTech) {
    return (
      <main className="simple-access-main">
        <div className="access-ambient one" />
        <div className="access-ambient two" />
        <section className="simple-access-card">
          <div className="access-brand-row">
            <div className="access-logo">FS</div>
            <div>
              <p className="eyebrow">Field Services North</p>
              <strong>Readiness Assessment</strong>
            </div>
          </div>

          <div className="access-hero-grid">
            <div>
              <p className="access-kicker">Technician access</p>
              <h1 className="access-title">
                <span>Field Services North</span>
                <span>Assessment</span>
              </h1>
              <p className="access-subtitle">Enter your assigned passcode to begin.</p>
            </div>
            <div className="access-mini-panel" aria-hidden="true">
              <span>Roster</span>
              <b>{techs.length}</b>
              <small>technicians</small>
            </div>
          </div>

          <label className="simple-passcode-label">
            Technician passcode
            <input
              type="password"
              value={assessmentPasscode}
              onChange={(event) => setAssessmentPasscode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") unlockAssessment();
              }}
              autoFocus
              autoComplete="one-time-code"
              placeholder="Enter your passcode"
            />
          </label>

          <button className="simple-submit" onClick={unlockAssessment}>
            Start assessment
          </button>

          {status && <div className="notice">{status}</div>}
          {error && <div className="notice error">{error}</div>}
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{heroKicker}</p>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      {status && <div className="notice">{status}</div>}
      {error && <div className="notice error">{error}</div>}

      {canViewMatrix && (
        <section className="manager-access-card" aria-label="Derek manager access">
          <div>
            <p className="eyebrow">Derek access</p>
            <h2>Team assessment matrix</h2>
            <span>Review team submissions, category averages, and readiness gaps.</span>
          </div>
          <nav className="portal-tabs" aria-label="Derek portal navigation">
            <button onClick={() => setMode("assessment")} className={mode === "assessment" ? "active" : ""}>
              My assessment
            </button>
            <button onClick={unlockDerekMatrix} className={mode === "matrix" ? "active" : ""}>
              View team matrix
            </button>
          </nav>
        </section>
      )}

      {mode === "assessment" ? (
        activeTech && assessmentLocked && lastResult ? (
          <section className="result-only">
            <div className="card result-card">
              <p className="eyebrow">Assessment submitted</p>
              <h2>{activeTech}, your result is recorded.</h2>
              <div className="result-hero-number">
                <span>Overall score</span>
                <strong>{lastResult.overall.toFixed(1)}</strong>
                <em>{lastResult.level}</em>
              </div>
              <div className="result-summary-grid">
                <div>
                  <span>Strengths</span>
                  <p>{lastResult.strengths.join(", ")}</p>
                </div>
                <div>
                  <span>Growth areas</span>
                  <p>{lastResult.gaps.join(", ")}</p>
                </div>
              </div>
              <div className="personal-score-list">
                {lastResult.categoryScores.map((category) => (
                  <div key={category.key}>
                    <span>{category.label}</span>
                    <b className={scoreClass(category.score)}>{category.score.toFixed(1)}</b>
                  </div>
                ))}
              </div>
              <p className="hint">This assessment is locked after submission. If you need a reset, contact the manager.</p>
            </div>
          </section>
        ) : activeTech ? (
          <section className="assessment-grid">
            <aside className="sidebar-card">
              <h2>{activeTech}</h2>
              <p className="hint">Complete each section before submitting your final assessment.</p>
              <div className="progress-block">
                <div>
                  <span>Progress</span>
                  <strong>{percentDone}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${percentDone}%` }} />
                </div>
                <p>{completedItems} of {totalItems} items complete</p>
              </div>
              <button className="submit" onClick={submitAssessment}>Submit assessment</button>
              {!completion.complete && (
                <p className="hint">
                  Missing {completion.missingStatements.length} self-ratings and {completion.missingQuiz.length} quiz answers.
                </p>
              )}
            </aside>

            <div className="assessment-flow">
              <section className="card">
                <div className="section-title">
                  <p className="eyebrow">Part 1</p>
                  <h2>Category ratings</h2>
                  <p>Rate your current confidence for each Field Services skill area.</p>
                </div>
                <div className="category-stack">
                  {categories.map((category) => (
                    <article className="category-card" key={category.key}>
                      <div>
                        <h3>{category.label}</h3>
                        <p>{category.description}</p>
                      </div>
                      {category.statements.map((statement) => (
                        <label className="rating-row" key={statement.id}>
                          <span>{statement.text}</span>
                          <select
                            value={answers[statement.id] ?? ""}
                            onChange={(event) =>
                              setAnswers((current) => ({ ...current, [statement.id]: Number(event.target.value) }))
                            }
                          >
                            <option value="">Score</option>
                            {[1, 2, 3, 4, 5].map((value) => (
                              <option key={value} value={value}>
                                {value} — {ratingLabels[value]}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </article>
                  ))}
                </div>
              </section>

              <section className="card">
                <div className="section-title">
                  <p className="eyebrow">Part 2</p>
                  <h2>Scenario quiz</h2>
                  <p>Select the best response for each service scenario.</p>
                </div>
                <div className="quiz-list">
                  {quizQuestions.map((question, index) => (
                    <article className="quiz-card" key={question.id}>
                      <div className="quiz-heading">
                        <span>Question {index + 1}</span>
                        <strong>{categories.find((category) => category.key === question.category)?.shortLabel}</strong>
                      </div>
                      <h3>{question.prompt}</h3>
                      <div className="options">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={option}
                            className={quiz[question.id] === optionIndex ? "answer-option selected" : "answer-option"}
                          >
                            <input
                              className="sr-only"
                              type="radio"
                              name={question.id}
                              checked={quiz[question.id] === optionIndex}
                              onChange={() => setQuiz((current) => ({ ...current, [question.id]: optionIndex }))}
                            />
                            <b>{String.fromCharCode(65 + optionIndex)}</b>
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        ) : (
          <section className="lock-screen">
            <div className="card lock-card">
              <p className="eyebrow">Technician access</p>
              <h2>Field Services North Assessment</h2>
              <label>
                Assessment passcode
                <input
                  type="password"
                  value={assessmentPasscode}
                  onChange={(event) => setAssessmentPasscode(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") unlockAssessment();
                  }}
                  autoComplete="one-time-code"
                />
              </label>
              <button className="submit" onClick={unlockAssessment}>Unlock assessment</button>
            </div>
          </section>
        )
      ) : canViewMatrix && matrixUnlocked ? (
        <section className="dashboard">
          <div className="kpi-grid">
            <div className="kpi">
              <span>Submitted</span>
              <strong>{submissions.length}/{techs.length}</strong>
              <p>{techs.length - submissions.length} remaining</p>
            </div>
            <div className="kpi">
              <span>Team average</span>
              <strong>{submissions.length ? averageOverall.toFixed(1) : "—"}</strong>
              <p>{submissions.length ? "60/40 blended score out of 5" : "No submissions yet"}</p>
            </div>
            <div className="kpi">
              <span>Biggest gap</span>
              <strong>{biggestGap?.shortLabel ?? "—"}</strong>
              <p>{biggestGap ? `${biggestGap.average.toFixed(1)} average` : "Waiting for data"}</p>
            </div>
            <div className="kpi">
              <span>Coverage watch</span>
              <strong>{categoryAverages.filter((item) => item.risk === "Gap" || item.risk === "Watch").length}</strong>
              <p>Categories below advanced-ready</p>
            </div>
          </div>

          <section className="card">
            <div className="section-title split">
              <div>
                <p className="eyebrow">Manager view</p>
                <h2>Team scoring matrix</h2>
                <p>Scores blend 60% self-assessment and 40% scenario quiz performance. Blank rows mean that tech has not submitted yet.</p>
              </div>
              <button className="secondary" onClick={() => loadSubmissions({ techPasscode: assessmentPasscode })}>Refresh results</button>
            </div>
            <div className="matrix-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Technician</th>
                    {categories.map((category) => (
                      <th key={category.key}>{category.shortLabel}</th>
                    ))}
                    <th>Overall</th>
                    <th>Level</th>
                    <th>Top strengths</th>
                    <th>Growth areas</th>
                  </tr>
                </thead>
                <tbody>
                  {techs.map((tech) => {
                    const submission = submissions.find((item) => item.techName === tech);
                    return (
                      <tr key={tech}>
                        <td><strong>{tech}</strong></td>
                        {categories.map((category) => {
                          const categoryScore = submission?.scores.categoryScores.find((score) => score.key === category.key);
                          return (
                            <td key={category.key} className={categoryScore ? scoreClass(categoryScore.score) : "empty"}>
                              {categoryScore ? categoryScore.score.toFixed(1) : "—"}
                            </td>
                          );
                        })}
                        <td className={submission ? scoreClass(submission.overall) : "empty"}>
                          {submission ? submission.overall.toFixed(1) : "—"}
                        </td>
                        <td>{submission?.level ?? "Not submitted"}</td>
                        <td>{submission?.scores.strengths.join(", ") ?? "—"}</td>
                        <td>{submission?.scores.gaps.join(", ") ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="coverage-grid">
            <div className="card">
              <div className="section-title">
                <p className="eyebrow">Coverage</p>
                <h2>Category averages</h2>
              </div>
              <div className="coverage-list">
                {categoryAverages.map((category) => (
                  <div key={category.key} className="coverage-row">
                    <div>
                      <strong>{category.label}</strong>
                      <span>Lead: {category.lead?.score ? `${category.lead.techName} (${category.lead.score.toFixed(1)})` : "No data"}</span>
                    </div>
                    <div className="coverage-meter">
                      <span style={{ width: `${Math.max(category.average, 0) * 20}%` }} />
                    </div>
                    <b className={scoreClass(category.average || 0)}>{category.average ? category.average.toFixed(1) : "—"}</b>
                    <em>{category.risk}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <p className="eyebrow">Roster</p>
                <h2>Submission status</h2>
              </div>
              <div className="roster">
                {techs.map((tech) => {
                  const submission = submissions.find((item) => item.techName === tech);
                  return (
                    <div key={tech}>
                      <span className={submission ? "dot done" : "dot"} />
                      <strong>{tech}</strong>
                      <small>{submission ? `${submission.level} · ${shortDate(submission.updatedAt)}` : "Not submitted"}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="report-grid">
            <div className="card report-card">
              <div className="section-title">
                <p className="eyebrow">Readiness summary</p>
                <h2>Team direction</h2>
                <p>Scoring now uses a 60% self-assessment and 40% scenario quiz blend.</p>
              </div>
              <div className="summary-grid">
                <div>
                  <span>Strongest area</span>
                  <strong>{strongestCategory?.shortLabel ?? "—"}</strong>
                  <p>{strongestCategory ? `${strongestCategory.average.toFixed(1)} team average` : "Waiting for submissions"}</p>
                </div>
                <div>
                  <span>Primary focus</span>
                  <strong>{weakestCategory?.shortLabel ?? "—"}</strong>
                  <p>{weakestCategory ? `${weakestCategory.average.toFixed(1)} team average` : "Waiting for submissions"}</p>
                </div>
                <div>
                  <span>Most balanced</span>
                  <strong>{mostBalanced?.techName ?? "—"}</strong>
                  <p>{mostBalanced ? `${mostBalanced.range.toFixed(1)} point spread` : "Waiting for submissions"}</p>
                </div>
                <div>
                  <span>Top specialist</span>
                  <strong>{topSpecialist?.techName ?? "—"}</strong>
                  <p>{topSpecialist ? `${topSpecialist.category} (${topSpecialist.score.toFixed(1)})` : "Waiting for submissions"}</p>
                </div>
              </div>
            </div>

            <div className="card report-card">
              <div className="section-title">
                <p className="eyebrow">Action planning</p>
                <h2>Team gap priority</h2>
              </div>
              <div className="priority-list">
                {gapPriorities.map((category, index) => (
                  <div key={category.key} className="priority-row">
                    <b>{index + 1}</b>
                    <div>
                      <strong>{category.label}</strong>
                      <span>{category.candidates.length ? `${category.candidates.length} cross-training candidate(s)` : "Coverage looks stable"}</span>
                    </div>
                    <em>{category.average.toFixed(1)}</em>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card report-card">
            <div className="section-title">
              <p className="eyebrow">Cross-training</p>
              <h2>Recommended pairings</h2>
              <p>Use this to turn lower category scores into specific mentoring or shadowing plans.</p>
            </div>
            <div className="cross-training-grid">
              {categoryReports.map((category) => (
                <article key={category.key} className="training-card">
                  <div>
                    <h3>{category.shortLabel}</h3>
                    <p>{category.recommendation}</p>
                  </div>
                  <div className="training-meta">
                    <span>Leads</span>
                    <strong>{category.leads.map((item) => item.techName).join(", ") || "Needs lead"}</strong>
                  </div>
                  <div className="training-meta">
                    <span>Candidates</span>
                    <strong>{category.candidates.map((item) => `${item.techName} (${item.score.toFixed(1)})`).join(", ") || "None"}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card report-card">
            <div className="section-title">
              <p className="eyebrow">Individual scorecards</p>
              <h2>Strengths, gaps, and next goals</h2>
            </div>
            <div className="scorecard-grid">
              {scorecards.map(({ submission, sortedScores, primaryGap, goal, pairing }) => (
                <article className="agent-scorecard" key={submission.techName}>
                  <div className="agent-scorecard-header">
                    <div>
                      <h3>{submission.techName}</h3>
                      <span>{submission.level}</span>
                    </div>
                    <strong>{submission.overall.toFixed(1)}</strong>
                  </div>
                  <div className="mini-skill-list">
                    {submission.scores.categoryScores.map((category) => (
                      <div key={category.key}>
                        <span>{categories.find((item) => item.key === category.key)?.shortLabel ?? category.label}</span>
                        <div className="mini-skill-meter">
                          <i style={{ width: `${Math.max(category.score, 0) * 20}%` }} />
                        </div>
                        <b>{category.score.toFixed(1)}</b>
                      </div>
                    ))}
                  </div>
                  <div className="scorecard-notes">
                    <p><b>Strength:</b> {sortedScores[0]?.label ?? "—"}</p>
                    <p><b>Focus:</b> {primaryGap?.label ?? "—"}</p>
                    <p>{pairing}</p>
                    <p>{goal}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card report-card">
            <div className="section-title">
              <p className="eyebrow">Calibration</p>
              <h2>Self-rating vs scenario quiz</h2>
              <p>Use this to spot confidence-building opportunities or areas where checklists/coaching may help.</p>
            </div>
            <div className="calibration-list">
              {calibrationNotes.map((item) => (
                <div key={item.techName}>
                  <strong>{item.techName}</strong>
                  <span>{item.note}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
      ) : (
        <section className="lock-screen">
          <div className="card lock-card">
            <p className="eyebrow">Assessment</p>
            <h2>Team matrix access is restricted.</h2>
            <button className="submit" onClick={() => setMode("assessment")}>Return to assessment</button>
          </div>
        </section>
      )}
    </main>
  );
}
