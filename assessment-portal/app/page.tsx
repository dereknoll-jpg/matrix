"use client";

import { useMemo, useState } from "react";
import {
  categories,
  quizQuestions,
  scoreAssessment,
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
  const [matrixPasscode, setMatrixPasscode] = useState("");
  const [activeTech, setActiveTech] = useState("");
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [quiz, setQuiz] = useState<QuizAnswers>({});
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [matrixUnlocked, setMatrixUnlocked] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<SubmissionResult | null>(null);

  const completion = useMemo(() => validateComplete(answers, quiz), [answers, quiz]);
  const preview = useMemo(() => scoreAssessment(answers, quiz), [answers, quiz]);
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
      setStatus(`Assessment unlocked for ${data.techName}.`);
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "Could not unlock assessment.");
    }
  }

  async function unlockMatrix() {
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "matrix", passcode: matrixPasscode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Invalid manager passcode.");

      setMatrixUnlocked(true);
      setStatus("Team matrix unlocked.");
      await loadSubmissions(matrixPasscode);
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "Could not unlock matrix.");
    }
  }

  async function loadSubmissions(passcode = matrixPasscode) {
    try {
      const response = await fetch("/api/submissions", {
        cache: "no-store",
        headers: { "x-admin-passcode": passcode },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load submissions.");
      setSubmissions(data.submissions ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load submissions.");
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
      if (!response.ok) throw new Error(data.error ?? "Could not save assessment.");

      setLastResult(data.submission);
      setStatus("Assessment saved. Thank you — your score is now included for the manager matrix.");
      if (matrixUnlocked) await loadSubmissions();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save assessment.");
      setStatus("");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("Link copied. Send this same link to the team.");
    } catch {
      setStatus("Copy was blocked by the browser. You can copy the address from the address bar.");
    }
  }

  if ((mode === "assessment" && !activeTech) || (mode === "matrix" && !matrixUnlocked)) {
    const isAssessment = mode === "assessment";

    return (
      <main className="simple-access-main">
        <section className="simple-access-card">
          <p className="eyebrow">Field Services IT</p>
          <h1>{isAssessment ? "Take your skill assessment" : "View the team matrix"}</h1>
          <p>
            {isAssessment
              ? "Enter your assigned technician passcode. The portal will identify you automatically."
              : "Enter the manager passcode to unlock team results and scoring."}
          </p>

          <div className="simple-switch">
            <button onClick={() => setMode("assessment")} className={isAssessment ? "active" : ""}>
              Assessment
            </button>
            <button onClick={() => setMode("matrix")} className={!isAssessment ? "active" : ""}>
              Team matrix
            </button>
          </div>

          <label className="simple-passcode-label">
            {isAssessment ? "Technician passcode" : "Manager passcode"}
            <input
              type="password"
              value={isAssessment ? assessmentPasscode : matrixPasscode}
              onChange={(event) =>
                isAssessment ? setAssessmentPasscode(event.target.value) : setMatrixPasscode(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (isAssessment) unlockAssessment();
                  else unlockMatrix();
                }
              }}
              autoFocus
              autoComplete="one-time-code"
              placeholder={isAssessment ? "Enter your passcode" : "Enter manager passcode"}
            />
          </label>

          <button className="simple-submit" onClick={isAssessment ? unlockAssessment : unlockMatrix}>
            {isAssessment ? "Start assessment" : "Unlock matrix"}
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
          <p className="eyebrow">Field Services IT</p>
          <h1>Service Desk Skill Assessment Portal</h1>
          <p>
            Send one link to your team. Each technician uses their assigned passcode to complete the
            assessment, and the manager passcode unlocks the team scoring matrix.
          </p>
          <div className="hero-actions">
            <button onClick={() => setMode("assessment")} className={mode === "assessment" ? "active" : ""}>
              Take assessment
            </button>
            <button onClick={() => setMode("matrix")} className={mode === "matrix" ? "active" : ""}>
              View team matrix
            </button>
            <button className="secondary" onClick={copyLink}>
              Copy share link
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <span>{matrixUnlocked ? "Completion" : "Matrix locked"}</span>
          <strong>{matrixUnlocked ? `${submissions.length}/${techs.length}` : "•••"}</strong>
          <p>{matrixUnlocked && submissions.length ? `${averageOverall.toFixed(1)} team average` : "Enter manager passcode to view team results"}</p>
          <div className="mini-bars" aria-hidden="true">
            {categoryAverages.map((category) => (
              <i key={category.key} style={{ height: `${Math.max(category.average, 0.3) * 18}%` }} />
            ))}
          </div>
        </div>
      </section>

      {status && <div className="notice">{status}</div>}
      {error && <div className="notice error">{error}</div>}

      {mode === "assessment" ? (
        activeTech ? (
          <section className="assessment-grid">
            <aside className="sidebar-card">
              <h2>{activeTech}</h2>
              <p className="hint">Your passcode has identified you. No name selection is needed.</p>
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
              <div className="score-preview">
                <span>Current preview</span>
                <strong>{Number.isFinite(preview.overall) ? preview.overall.toFixed(1) : "—"}</strong>
                <p>{preview.level}</p>
              </div>
              <button className="submit" onClick={submitAssessment}>Submit assessment</button>
              {!completion.complete && (
                <p className="hint">
                  Missing {completion.missingStatements.length} self-ratings and {completion.missingQuiz.length} quiz answers.
                </p>
              )}
              {lastResult && (
                <div className="score-preview">
                  <span>Submitted result</span>
                  <strong>{lastResult.overall.toFixed(1)}</strong>
                  <p>{lastResult.level}</p>
                </div>
              )}
            </aside>

            <div className="assessment-flow">
              <section className="card">
                <div className="section-title">
                  <p className="eyebrow">Part 1</p>
                  <h2>Self-assessment by service desk category</h2>
                  <p>Use 1 for “not yet” and 5 for “expert / sets standards.” Be honest — this works best as a coaching tool.</p>
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
                  <p>These questions add a practical check to the self-score. The quiz contributes 30% of each applicable category score.</p>
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
                          <label key={option}>
                            <input
                              type="radio"
                              name={question.id}
                              checked={quiz[question.id] === optionIndex}
                              onChange={() => setQuiz((current) => ({ ...current, [question.id]: optionIndex }))}
                            />
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
              <h2>Enter your assigned assessment passcode</h2>
              <p>Your passcode identifies you automatically, so you will not need to choose your name.</p>
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
      ) : matrixUnlocked ? (
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
              <p>{submissions.length ? "Blended score out of 5" : "No submissions yet"}</p>
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
                <p>Scores blend self-assessment and scenario quiz performance. Blank rows mean that tech has not submitted yet.</p>
              </div>
              <button className="secondary" onClick={() => loadSubmissions()}>Refresh results</button>
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
        </section>
      ) : (
        <section className="lock-screen">
          <div className="card lock-card">
            <p className="eyebrow">Manager access</p>
            <h2>Enter the manager passcode</h2>
            <p>The matrix and aggregate submissions are protected so public visitors cannot view team results.</p>
            <label>
              Manager passcode
              <input
                type="password"
                value={matrixPasscode}
                onChange={(event) => setMatrixPasscode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") unlockMatrix();
                }}
                autoComplete="current-password"
              />
            </label>
            <button className="submit" onClick={unlockMatrix}>Unlock team matrix</button>
          </div>
        </section>
      )}
    </main>
  );
}
