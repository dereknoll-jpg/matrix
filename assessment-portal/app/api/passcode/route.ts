import { verifyAdminPasscode, verifyTechPasscode } from "../../../lib/passcodes";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    passcode?: string;
    purpose?: "assessment" | "matrix";
  };

  const passcode = payload.passcode ?? "";
  if (payload.purpose === "matrix") {
    const result = verifyAdminPasscode(passcode);
    if (!result.ok) {
      return Response.json({ error: result.message }, { status: 401 });
    }
    return Response.json({ ok: true, purpose: "matrix" });
  }

  const result = verifyTechPasscode(passcode);
  if (!result.ok) {
    return Response.json({ error: result.message }, { status: 401 });
  }

  if (result.kind === "matrix-manager") {
    return Response.json({
      ok: true,
      purpose: "matrix",
      techName: result.techName,
      manager: true,
    });
  }

  if (result.kind !== "tech") {
    return Response.json({ error: "Invalid technician passcode." }, { status: 401 });
  }

  return Response.json({
    ok: true,
    purpose: "assessment",
    techName: result.techName,
  });
}
