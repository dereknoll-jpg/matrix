import type { SubmissionResult } from "./assessment";

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

export async function writeSubmissions(submissions: StoredSubmission[]) {
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

export function submissionRouteError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("Vercel KV is not configured")) {
    return "Storage is not configured yet. Add Vercel KV to this Vercel project so team submissions persist.";
  }
  return message;
}
