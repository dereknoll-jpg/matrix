import {
  scoreAssessment,
  techs,
  validateComplete,
  type AssessmentAnswers,
  type QuizAnswers,
  type SubmissionResult,
} from "../../../lib/assessment";

export const dynamic = "force-dynamic";

type StoredSubmission = {
  id: number;
  techName: string;
  overall: number;
  level: string;
  scores: SubmissionResult;
  updatedAt: string;
};

const memoryStore = globalThis as typeof globalThis & {
  __assessmentSubmissions?: StoredSubmission[];
};

const KV_KEY = "field-services-assessment-submissions";

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvRequest(path: string, init?: RequestInit) {
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error("Vercel KV is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json()) as { result?: unknown; error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "Vercel KV request failed.");
  }
  return data.result;
}

async function readSubmissions(): Promise<StoredSubmission[]> {
  if (!hasKv()) {
    memoryStore.__assessmentSubmissions ??= [];
    return memoryStore.__assessmentSubmissions;
  }

  const result = await kvRequest(`/get/${encodeURIComponent(KV_KEY)}`);
  if (!result || typeof result !== "string") return [];

  try {
    return JSON.parse(result) as StoredSubmission[];
  } catch {
    return [];
  }
}

async function writeSubmissions(submissions: StoredSubmission[]) {
  if (!hasKv()) {
    memoryStore.__assessmentSubmissions = submissions;
    return;
  }

  await kvRequest(`/set/${encodeURIComponent(KV_KEY)}`, {
    method: "POST",
    body: JSON.stringify(JSON.stringify(submissions)),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function routeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("Vercel KV is not configured")) {
    return "Storage is not configured yet. Add Vercel KV to this Vercel project so team submissions persist.";
  }
  return message;
}

export async function GET() {
  try {
    const submissions = await readSubmissions();
    return Response.json({
      submissions: submissions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      storage: hasKv() ? "vercel-kv" : "memory",
    });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      techName?: string;
      answers?: AssessmentAnswers;
      quiz?: QuizAnswers;
    };

    const techName = payload.techName?.trim() ?? "";
    if (!techs.includes(techName as never)) {
      return Response.json({ error: "Select a valid technician." }, { status: 400 });
    }

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

    const storedSubmission: StoredSubmission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : Date.now(),
      techName,
      overall: result.overall,
      level: result.level,
      scores: result,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      submissions[existingIndex] = storedSubmission;
    } else {
      submissions.push(storedSubmission);
    }

    await writeSubmissions(submissions);
    return Response.json({ submission: { techName, ...result }, storage: hasKv() ? "vercel-kv" : "memory" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}
