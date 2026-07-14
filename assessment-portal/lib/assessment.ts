export const techs = [
  "Dalton Tyler",
  "Tim Kay",
  "Justin Ward",
  "Justin Sokola",
  "Matthew Bouley",
  "Cameron Densmore",
  "Nyasia Torres",
  "Tony Luo",
  "Derek Noll",
] as const;

export type TechName = (typeof techs)[number];

export type CategoryKey =
  | "pc"
  | "software"
  | "network"
  | "security"
  | "identity"
  | "hardware"
  | "process"
  | "communication"
  | "ownership";

export type AssessmentAnswers = Record<string, number>;
export type QuizAnswers = Record<string, number>;

export type CategoryScore = {
  key: CategoryKey;
  label: string;
  score: number;
  selfAverage: number;
  quizPercent: number | null;
  level: string;
};

export type SubmissionResult = {
  categoryScores: CategoryScore[];
  overall: number;
  level: string;
  strengths: string[];
  gaps: string[];
};

export const categories: {
  key: CategoryKey;
  label: string;
  shortLabel: string;
  description: string;
  statements: { id: string; text: string }[];
}[] = [
  {
    key: "pc",
    label: "General PC Troubleshooting",
    shortLabel: "PC Troubleshooting",
    description: "Windows, performance, printing, profiles, updates, and repeatable diagnostic flow.",
    statements: [
      { id: "pc_1", text: "I can isolate whether an issue is OS, profile, hardware, network, or application related." },
      { id: "pc_2", text: "I can resolve common Windows performance, update, printer, and peripheral problems without handholding." },
      { id: "pc_3", text: "I document the root cause, fix, and prevention notes clearly enough for another tech to continue." },
    ],
  },
  {
    key: "software",
    label: "Software & Applications",
    shortLabel: "Software",
    description: "Business apps, Microsoft 365, installs, licensing, browser issues, and app-specific triage.",
    statements: [
      { id: "software_1", text: "I can troubleshoot application install, update, licensing, and compatibility issues." },
      { id: "software_2", text: "I can support Outlook, Teams, OneDrive, browsers, and core business applications." },
      { id: "software_3", text: "I know when to repair, reinstall, reset cache/profile, escalate to vendor, or document a workaround." },
    ],
  },
  {
    key: "network",
    label: "Network & Infrastructure",
    shortLabel: "Network/Infra",
    description: "DNS, DHCP, VPN, Wi-Fi, cabling, VLAN context, outages, and remote-hands work.",
    statements: [
      { id: "network_1", text: "I can troubleshoot DNS, DHCP, gateway, Wi-Fi, VPN, and basic connectivity issues." },
      { id: "network_2", text: "I can gather useful evidence for network/infrastructure escalations, including scope and affected services." },
      { id: "network_3", text: "I can safely act as remote hands for infrastructure teams without improvising risky changes." },
    ],
  },
  {
    key: "security",
    label: "Security & Compliance",
    shortLabel: "Security",
    description: "Phishing, malware, endpoint protection, data handling, encryption, and least privilege.",
    statements: [
      { id: "security_1", text: "I follow the correct process for phishing, malware, lost device, and suspicious activity reports." },
      { id: "security_2", text: "I understand least privilege and handle admin/access exceptions with the right approvals and audit trail." },
      { id: "security_3", text: "I can explain security requirements to users without making them feel blamed or blocked." },
    ],
  },
  {
    key: "identity",
    label: "Account & Access Management",
    shortLabel: "Identity/Access",
    description: "Password, MFA, groups, permissions, onboarding/offboarding, shared resources, and access requests.",
    statements: [
      { id: "identity_1", text: "I can resolve password, MFA, lockout, group membership, mailbox, and shared resource issues." },
      { id: "identity_2", text: "I can distinguish identity issues from application, device, or network issues." },
      { id: "identity_3", text: "I verify approval, business need, and impact before changing permissions or access." },
    ],
  },
  {
    key: "hardware",
    label: "Hardware & Peripherals",
    shortLabel: "Hardware",
    description: "Laptops, docks, monitors, printers, mobile devices, imaging, warranty, and replacements.",
    statements: [
      { id: "hardware_1", text: "I can diagnose laptop, desktop, dock, display, printer, and mobile device issues." },
      { id: "hardware_2", text: "I can provision, image, enroll, encrypt, and validate replacement equipment." },
      { id: "hardware_3", text: "I can coordinate warranty, RMA, loaner, spare, and return workflows cleanly." },
    ],
  },
  {
    key: "process",
    label: "Service Desk Process",
    shortLabel: "Process",
    description: "Ticket quality, SLA hygiene, prioritization, escalation, knowledge articles, and metrics.",
    statements: [
      { id: "process_1", text: "My tickets include impact, symptoms, troubleshooting steps, evidence, resolution, and next owner when needed." },
      { id: "process_2", text: "I prioritize work using business impact, urgency, SLA, dependencies, and customer communication needs." },
      { id: "process_3", text: "I create or improve knowledge articles when repeat issues show a pattern." },
    ],
  },
  {
    key: "communication",
    label: "Customer Communication",
    shortLabel: "Communication",
    description: "User empathy, executive support, expectation setting, training, and difficult conversations.",
    statements: [
      { id: "communication_1", text: "I can explain technical issues clearly to non-technical users." },
      { id: "communication_2", text: "I communicate delays, next steps, dependencies, and workarounds before users have to chase me." },
      { id: "communication_3", text: "I stay calm and professional during urgent, frustrating, or high-visibility support situations." },
    ],
  },
  {
    key: "ownership",
    label: "Field Readiness & Ownership",
    shortLabel: "Ownership",
    description: "Onsite readiness, follow-through, asset discipline, vendor coordination, and continuous improvement.",
    statements: [
      { id: "ownership_1", text: "I prepare for onsite work with tools, access, parts, contacts, risk checks, and a fallback plan." },
      { id: "ownership_2", text: "I follow through until the user, ticket, asset record, and any vendor dependency are truly closed." },
      { id: "ownership_3", text: "I look for patterns and suggest improvements instead of only fixing one ticket at a time." },
    ],
  },
];

export const quizQuestions: {
  id: string;
  category: CategoryKey;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}[] = [
  {
    id: "q1",
    category: "pc",
    prompt: "A user says their laptop is suddenly slow after login. What is the best first troubleshooting move?",
    options: [
      "Start by disabling startup apps and clearing temporary files, then see if the user reports improvement.",
      "Gather symptoms, recent changes, resource usage, disk health, startup items, and whether the issue follows the user profile.",
      "Reimage the laptop if the user needs a fast resolution and there are no obvious hardware errors.",
      "Run vendor hardware diagnostics before looking at the Windows session or user profile.",
    ],
    correctIndex: 1,
    explanation: "Good PC troubleshooting starts with evidence and isolation before applying a fix.",
  },
  {
    id: "q2",
    category: "software",
    prompt: "An app fails for one user but works for others on the same network. What should you check early?",
    options: [
      "Open a network/firewall escalation with the app name and the user's location.",
      "User profile/cache, permissions/licensing, app version, and whether the issue follows the user to another device.",
      "Reinstall the application on the user's current device and monitor for recurrence.",
      "Ask the application owner to review the service status before changing anything locally.",
    ],
    correctIndex: 1,
    explanation: "One-user software issues often sit in profile, permissions, licensing, or local app state.",
  },
  {
    id: "q3",
    category: "network",
    prompt: "A user has Wi-Fi connected but cannot reach cloud services. Which evidence is most useful before escalation?",
    options: [
      "SSID, signal strength, device model, and whether the user can reach internal resources.",
      "IP address, gateway, DNS results, captive portal/proxy/VPN state, affected services, and whether others nearby are impacted.",
      "A screenshot of the browser error and the user's current physical location.",
      "Confirmation that the user rebooted and tried another browser.",
    ],
    correctIndex: 1,
    explanation: "Network escalations need scope plus basic connectivity and name-resolution evidence.",
  },
  {
    id: "q4",
    category: "security",
    prompt: "A user reports a suspicious email and says they clicked the link. What should you do first?",
    options: [
      "Have the user delete the email, then remind them to report similar messages next time.",
      "Follow the incident process: preserve/report evidence, assess account/device risk, contain if needed, and escalate appropriately.",
      "Reset the user's password and close the ticket if sign-in appears normal afterward.",
      "Run an antivirus scan and wait for an alert before escalating.",
    ],
    correctIndex: 1,
    explanation: "Security response should preserve evidence, contain risk, and follow the approved path.",
  },
  {
    id: "q5",
    category: "identity",
    prompt: "A user asks for access to a shared mailbox. What is the best approach?",
    options: [
      "Grant read access first, then adjust permissions later if the owner objects.",
      "Verify approval/business need, confirm the right mailbox and permission type, make the change, and document it.",
      "Ask a current mailbox member to forward needed messages until the request is approved.",
      "Add the user to the broadest related group so future mailbox requests are reduced.",
    ],
    correctIndex: 1,
    explanation: "Access changes require least privilege, approval, accuracy, and an audit trail.",
  },
  {
    id: "q6",
    category: "hardware",
    prompt: "A laptop replacement is complete. What should be verified before handoff?",
    options: [
      "Power-on, Windows login, and that the device has the standard image.",
      "Enrollment, encryption, required apps, user sign-in, data/access needs, updates, peripherals, and asset record.",
      "That the device joins Wi-Fi and the user can open email.",
      "That the asset tag and charger are correct before closing the ticket.",
    ],
    correctIndex: 1,
    explanation: "Good replacement work validates the whole user-ready state, not just the hardware.",
  },
  {
    id: "q7",
    category: "process",
    prompt: "What makes an escalation useful?",
    options: [
      "The user's latest description, a screenshot, and the assignment group you think should own it.",
      "Impact, scope, timeline, environment, logs/screenshots, steps tried, result of each step, and a clear ask.",
      "A summary of the suspected cause and a request for the next team to investigate.",
      "The ticket number, affected user, and a note that standard troubleshooting was completed.",
    ],
    correctIndex: 1,
    explanation: "Escalations should reduce rework and help the next resolver act quickly.",
  },
  {
    id: "q8",
    category: "communication",
    prompt: "A fix will take longer than expected. What is the best customer communication?",
    options: [
      "Wait until there is a confirmed fix so the user receives accurate information.",
      "Explain the delay plainly, provide the current owner, next step, workaround if available, and when they will hear back.",
      "Send the technical notes from the escalation so the user can see the work is moving.",
      "Move the ticket to pending while the resolver group investigates.",
    ],
    correctIndex: 1,
    explanation: "Clear expectation-setting preserves trust even when the fix is delayed.",
  },
  {
    id: "q9",
    category: "ownership",
    prompt: "Before going onsite for a vague issue, what should you do?",
    options: [
      "Go onsite first so you can see the issue directly and gather details in person.",
      "Confirm scope, user/contact, access, tools, parts, risk, timing, and fallback plan.",
      "Ask the user for a screenshot and bring a standard toolkit.",
      "Schedule extra time and plan to troubleshoot once you arrive.",
    ],
    correctIndex: 1,
    explanation: "Field readiness means reducing avoidable surprises before the visit.",
  },
  {
    id: "q10",
    category: "security",
    prompt: "A user requests local admin rights to install a tool. What is the strongest response?",
    options: [
      "Grant temporary local admin rights and ask the user to notify IT when finished.",
      "Validate business need, use approved installation or temporary elevation process, document approval, and avoid unnecessary privilege.",
      "Install the tool if it appears safe, then remove the user from local admin later.",
      "Ask the user's manager to approve the request before checking software policy.",
    ],
    correctIndex: 1,
    explanation: "Least privilege protects the business while still supporting legitimate work.",
  },
  {
    id: "q11",
    category: "network",
    prompt: "Several users in one area lose network access after a move. What should you check?",
    options: [
      "Whether the affected users can sign in from a different device or location.",
      "Local scope, switch port/jack/cabling, VLAN/port config evidence, Wi-Fi vs wired, and whether infrastructure teams need remote-hands detail.",
      "Whether the issue affects one application, all applications, or internet browsing.",
      "Device manager network adapter status and whether Windows updates recently installed.",
    ],
    correctIndex: 1,
    explanation: "Area-based network issues often require physical and infrastructure context.",
  },
  {
    id: "q12",
    category: "process",
    prompt: "A ticket repeats across many users. What is the best service desk move?",
    options: [
      "Resolve each ticket using the known fix and tag them consistently for reporting.",
      "Identify the pattern, document the known fix, notify stakeholders, and propose a durable prevention or automation step.",
      "Merge duplicate tickets into the oldest case and continue troubleshooting there.",
      "Escalate the next occurrence with the most recent example and wait for direction.",
    ],
    correctIndex: 1,
    explanation: "Strong service desk work turns repeat incidents into process improvement.",
  },
];

export function levelForScore(score: number) {
  if (score >= 4.5) return "Expert";
  if (score >= 3.75) return "Advanced";
  if (score >= 3) return "Capable";
  if (score >= 2) return "Developing";
  return "Novice";
}

export function scoreAssessment(answers: AssessmentAnswers, quiz: QuizAnswers): SubmissionResult {
  const categoryScores = categories.map((category) => {
    const selfScores = category.statements.map((statement) => Number(answers[statement.id] ?? 0)).filter(Boolean);
    const selfAverage = selfScores.length
      ? selfScores.reduce((sum, value) => sum + value, 0) / selfScores.length
      : 0;

    const categoryQuiz = quizQuestions.filter((question) => question.category === category.key);
    const answeredQuiz = categoryQuiz.filter((question) => quiz[question.id] !== undefined);
    const correct = answeredQuiz.filter((question) => quiz[question.id] === question.correctIndex).length;
    const quizPercent = categoryQuiz.length ? correct / categoryQuiz.length : null;
    const quizScore = quizPercent === null ? selfAverage : quizPercent * 5;
    const score = Math.round((selfAverage * 0.7 + quizScore * 0.3) * 10) / 10;

    return {
      key: category.key,
      label: category.label,
      score,
      selfAverage: Math.round(selfAverage * 10) / 10,
      quizPercent: quizPercent === null ? null : Math.round(quizPercent * 100),
      level: levelForScore(score),
    };
  });

  const overall = Math.round(
    (categoryScores.reduce((sum, item) => sum + item.score, 0) / categoryScores.length) * 10
  ) / 10;
  const sorted = [...categoryScores].sort((a, b) => b.score - a.score);

  return {
    categoryScores,
    overall,
    level: levelForScore(overall),
    strengths: sorted.slice(0, 2).map((item) => item.label),
    gaps: sorted.slice(-2).reverse().map((item) => item.label),
  };
}

export function validateComplete(answers: AssessmentAnswers, quiz: QuizAnswers) {
  const missingStatements = categories.flatMap((category) =>
    category.statements.filter((statement) => !answers[statement.id]).map((statement) => statement.text)
  );
  const missingQuiz = quizQuestions.filter((question) => quiz[question.id] === undefined).map((question) => question.prompt);

  return {
    complete: missingStatements.length === 0 && missingQuiz.length === 0,
    missingStatements,
    missingQuiz,
  };
}
