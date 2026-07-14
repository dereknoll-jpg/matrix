import { verifyTechPasscode } from "../../../lib/passcodes";
import { readSubmissions, submissionRouteError } from "../../../lib/submissionStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const techPasscode = new URL(request.url).searchParams.get("techPasscode") ?? request.headers.get("x-tech-passcode") ?? "";
    const techCheck = verifyTechPasscode(techPasscode);
    if (!techCheck.ok) {
      return Response.json({ error: techCheck.message }, { status: 401 });
    }
    if (techCheck.kind !== "tech") {
      return Response.json({ error: "Invalid technician passcode." }, { status: 401 });
    }

    const submissions = await readSubmissions();
    const submission = submissions.find((item) => item.techName === techCheck.techName);
    return Response.json({ techName: techCheck.techName, submission: submission ?? null });
  } catch (error) {
    return Response.json({ error: submissionRouteError(error) }, { status: 500 });
  }
}
