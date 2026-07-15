import {
  isAssessmentTechName,
  scoreAssessment,
  validateComplete,
  type AssessmentAnswers,
  type QuizAnswers,
} from "../../../lib/assessment";
import { verifyAdminPasscode, verifyTechPasscode } from "../../../lib/passcodes";
import { hasKv, readSubmissions, submissionRouteError, writeSubmissions, type StoredSubmission } from "../../../lib/submissionStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const adminPasscode = new URL(request.url).searchParams.get("adminPasscode") ?? request.headers.get("x-admin-passcode") ?? "";
    const techPasscode = request.headers.get("x-tech-passcode") ?? "";
    const adminCheck = verifyAdminPasscode(adminPasscode);
    const techCheck = verifyTechPasscode(techPasscode);
    const managerMatrixAccess = techCheck.ok && techCheck.kind === "matrix-manager";

    if (!adminCheck.ok && !managerMatrixAccess) {
      return Response.json({ error: "Team matrix access is restricted." }, { status: 401 });
    }

    const submissions = (await readSubmissions()).filter((submission) => isAssessmentTechName(submission.techName));
    return Response.json({
      submissions: [...submissions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      storage: hasKv() ? "vercel-kv" : "memory",
    });
  } catch (error) {
    return Response.json({ error: submissionRouteError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      techPasscode?: string;
      answers?: AssessmentAnswers;
      quiz?: QuizAnswers;
    };

    const techCheck = verifyTechPasscode(payload.techPasscode ?? "");
    if (!techCheck.ok) {
      return Response.json({ error: techCheck.message }, { status: 401 });
    }
    if (techCheck.kind !== "tech") {
      return Response.json({ error: "Invalid technician passcode." }, { status: 401 });
    }
    const techName = techCheck.techName;

    const answers = payload.answers ?? {};
    const quiz = payload.quiz ?? {};
    const completion = validateComplete(answers, quiz);
    if (!completion.complete) {
      return Response.json(
        { error: "Complete all self-assessment and quiz questions before submitting." },
        { status: 400 }
      );
    }

    const result = scoreAssessment(answers, quiz);
    const now = new Date().toISOString();
    const submissions = await readSubmissions();
    const existingIndex = submissions.findIndex((submission) => submission.techName === techName);

    if (existingIndex >= 0) {
      return Response.json(
        {
          error: "Assessment already submitted. You can view your existing result, but you cannot retake it.",
          submission: submissions[existingIndex],
        },
        { status: 409 }
      );
    }

    const storedSubmission: StoredSubmission = {
      id: Date.now(),
      techName,
      overall: result.overall,
      level: result.level,
      scores: result,
      updatedAt: now,
    };

    submissions.push(storedSubmission);
    await writeSubmissions(submissions);
    return Response.json({ submission: { techName, ...result }, storage: hasKv() ? "vercel-kv" : "memory" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: submissionRouteError(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const adminPasscode = request.headers.get("x-admin-passcode") ?? "";
    const techPasscode = request.headers.get("x-tech-passcode") ?? "";
    const adminCheck = verifyAdminPasscode(adminPasscode);
    const techCheck = verifyTechPasscode(techPasscode);
    const managerMatrixAccess = techCheck.ok && techCheck.kind === "matrix-manager";

    if (!adminCheck.ok && !managerMatrixAccess) {
      return Response.json({ error: "Team matrix access is restricted." }, { status: 401 });
    }

    const payload = (await request.json()) as { techName?: string };
    const techName = payload.techName ?? "";
    if (!isAssessmentTechName(techName)) {
      return Response.json({ error: "Invalid technician name." }, { status: 400 });
    }

    const submissions = await readSubmissions();
    const remaining = submissions.filter((submission) => submission.techName !== techName);
    const removed = submissions.length - remaining.length;
    await writeSubmissions(remaining);

    return Response.json({
      ok: true,
      removed,
      techName,
      storage: hasKv() ? "vercel-kv" : "memory",
    });
  } catch (error) {
    return Response.json({ error: submissionRouteError(error) }, { status: 500 });
  }
}
