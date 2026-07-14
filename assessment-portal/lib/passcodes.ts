import { techs, type TechName } from "./assessment";

export type PasscodeCheck =
  | { ok: true; kind: "admin" }
  | { ok: true; kind: "tech"; techName: TechName }
  | { ok: false; message: string };

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export function getAdminPasscode() {
  return clean(process.env.ADMIN_MATRIX_PASSCODE);
}

export function getTechPasscodes(): Record<TechName, string> {
  const raw = process.env.TECH_PASSCODES_JSON;
  if (!raw) return {} as Record<TechName, string>;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      techs.map((tech) => [tech, clean(parsed[tech])])
    ) as Record<TechName, string>;
  } catch {
    return {} as Record<TechName, string>;
  }
}

export function verifyAdminPasscode(passcode: string): PasscodeCheck {
  const configured = getAdminPasscode();
  if (!configured) {
    return { ok: false, message: "Admin passcode is not configured." };
  }
  if (clean(passcode) !== configured) {
    return { ok: false, message: "Invalid manager passcode." };
  }
  return { ok: true, kind: "admin" };
}

export function verifyTechPasscode(passcode: string): PasscodeCheck {
  const candidate = clean(passcode);
  const passcodes = getTechPasscodes();
  if (!Object.values(passcodes).some(Boolean)) {
    return { ok: false, message: "Technician passcodes are not configured." };
  }

  const match = techs.find((tech) => passcodes[tech] === candidate);
  if (!match) {
    return { ok: false, message: "Invalid technician passcode." };
  }

  return { ok: true, kind: "tech", techName: match };
}

