import { rebalanceResult, type SubmissionResult } from "./assessment";

export type StoredSubmission = {
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

function isStoredSubmission(value: unknown): value is StoredSubmission {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<StoredSubmission>;
  return (
    typeof item.techName === "string" &&
    typeof item.overall === "number" &&
    typeof item.level === "string" &&
    typeof item.updatedAt === "string" &&
    Boolean(item.scores)
  );
}

function normalizeStoredSubmission(submission: StoredSubmission): StoredSubmission {
  const scores = rebalanceResult(submission.scores);
  return {
    ...submission,
    overall: scores.overall,
    level: scores.level,
    scores,
  };
}

export function coerceSubmissions(value: unknown, depth = 0): StoredSubmission[] {
  if (!value || depth > 3) return [];

  if (typeof value === "string") {
    try {
      return coerceSubmissions(JSON.parse(value), depth + 1);
    } catch {
      return [];
    }
  }

  if (Array.isArray(value)) {
    return value.filter(isStoredSubmission);
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    for (const key of ["submissions", "data", "result", "value"]) {
      if (key in objectValue) {
        const normalized = coerceSubmissions(objectValue[key], depth + 1);
        if (normalized.length) return normalized;
      }
    }

    const values = Object.values(objectValue);
    if (values.some(isStoredSubmission)) return values.filter(isStoredSubmission);
  }

  return [];
}

export function normalizeSubmissions(value: unknown, depth = 0): StoredSubmission[] {
  return coerceSubmissions(value, depth).map(normalizeStoredSubmission);
}

export function hasKv() {
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

export async function readSubmissions(): Promise<StoredSubmission[]> {
  if (!hasKv()) {
    memoryStore.__assessmentSubmissions ??= [];
    memoryStore.__assessmentSubmissions = normalizeSubmissions(memoryStore.__assessmentSubmissions);
    return memoryStore.__assessmentSubmissions;
  }

  const result = await kvRequest(`/get/${encodeURIComponent(KV_KEY)}`);
  return normalizeSubmissions(result);
}

export async function writeSubmissions(submissions: StoredSubmission[]) {
  const normalized = coerceSubmissions(submissions);
  if (!hasKv()) {
    memoryStore.__assessmentSubmissions = normalized;
    return;
  }

  await kvRequest(`/set/${encodeURIComponent(KV_KEY)}`, {
    method: "POST",
    body: JSON.stringify(JSON.stringify(normalized)),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function submissionRouteError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("Vercel KV is not configured")) {
    return "Storage is not configured yet. Add Vercel KV to this Vercel project so team submissions persist.";
  }
  return message;
}
