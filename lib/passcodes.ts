import { matrixManagers, techs, type MatrixManagerName, type TechName } from "./assessment";

export type PasscodeCheck =
  | { ok: true; kind: "admin" }
  | { ok: true; kind: "tech"; techName: TechName }
  | { ok: true; kind: "matrix-manager"; techName: MatrixManagerName }
  | { ok: false; message: string };

type PasscodeOwner = TechName | MatrixManagerName;
const passcodeOwners = [...techs, ...matrixManagers] as const;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export function getAdminPasscode() {
  return clean(process.env.ADMIN_MATRIX_PASSCODE);
}

export function getTechPasscodes(): Record<PasscodeOwner, string> {
  const raw = process.env.TECH_PASSCODES_JSON;
  if (!raw) return {} as Record<PasscodeOwner, string>;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      passcodeOwners.map((owner) => [owner, clean(parsed[owner])])
    ) as Record<PasscodeOwner, string>;
  } catch {
    return {} as Record<PasscodeOwner, string>;
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

  const techMatch = techs.find((tech) => passcodes[tech] === candidate);
  if (techMatch) {
    return { ok: true, kind: "tech", techName: techMatch };
  }

  const managerMatch = matrixManagers.find((manager) => passcodes[manager] === candidate);
  if (managerMatch) {
    return { ok: true, kind: "matrix-manager", techName: managerMatch };
  }

  return { ok: false, message: "Invalid technician passcode." };
}
