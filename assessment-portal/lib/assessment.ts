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

export const SELF_ASSESSMENT_WEIGHT = 0.8;
export const QUIZ_WEIGHT = 0.2;

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
    prompt: "A dispatcher says their Windows laptop is almost unusable for the first 15 minutes after login, but works normally later in the day. What is the strongest next step?",
    options: [
      "Check startup load, resource usage, disk health, updates, and profile behavior.",
      "Reimage the laptop if the user needs a fast resolution today.",
      "Disable several startup apps and ask the user to monitor tomorrow.",
      "Run hardware diagnostics before reviewing Windows or profile behavior.",
    ],
    correctIndex: 0,
    explanation: "The symptom has a pattern, so the best response is to collect evidence and isolate startup/profile/update causes before changing the device.",
  },
  {
    id: "q2",
    category: "network",
    prompt: "A small group moved desks this morning. Wired network is down for that row, Wi-Fi works, and nearby unmoved users are fine. What information should go to Infrastructure if you escalate?",
    options: [
      "Affected users, reboot confirmation, and a request to check network access.",
      "Browser screenshots, desk numbers, and the move completion time.",
      "App scope, sign-in status, and whether another workstation works.",
      "Jack locations, wired-only scope, cable checks, IP/VLAN notes, and timing.",
    ],
    correctIndex: 3,
    explanation: "Infrastructure escalations are strongest when they include physical scope, network observations, and a clear remote-hands ask.",
  },
  {
    id: "q3",
    category: "communication",
    prompt: "An upset manager says, “This has been open for three days and nobody in IT cares.” You can see the ticket is waiting on a vendor. What is the best response?",
    options: [
      "Explain that the vendor owns the delay and IT is waiting.",
      "Acknowledge the concern, summarize status, next follow-up, and workaround options.",
      "Send the vendor thread so they can see the current blocker.",
      "Raise the ticket priority so the escalation is visible.",
    ],
    correctIndex: 1,
    explanation: "Difficult-user situations need ownership, clear expectations, and calm communication rather than defensiveness.",
  },
  {
    id: "q4",
    category: "software",
    prompt: "A line-of-business app crashes only for one user. It works for other users on the same PC, and the same user has the issue on a second PC. Where should you focus first?",
    options: [
      "Reinstall the app on the first PC and clear temporary files.",
      "Check office firewall rules and network path availability.",
      "Review permissions, licensing, profile data, and account-specific settings.",
      "Replace the original PC because the issue started there.",
    ],
    correctIndex: 2,
    explanation: "When the issue follows the user across devices, account/profile/licensing causes become more likely than a local device fault.",
  },
  {
    id: "q5",
    category: "security",
    prompt: "A user reports MFA prompts they did not initiate, and sign-in logs show unusual attempts from outside the normal region. What is the best Field Services response?",
    options: [
      "Reset the password, confirm sign-in works, and monitor for recurrence.",
      "Tell the user to deny prompts and report future attempts.",
      "Temporarily remove MFA so the user can continue working.",
      "Contain per process, preserve evidence, and escalate to Cybersecurity.",
    ],
    correctIndex: 3,
    explanation: "Suspicious MFA activity is security-sensitive and should be contained and elevated to Cybersecurity through the approved process.",
  },
  {
    id: "q6",
    category: "identity",
    prompt: "A supervisor asks you to add a new employee to several shared mailboxes and a restricted application group before HR onboarding is fully complete. What should you do?",
    options: [
      "Verify onboarding, approvals, permission levels, and business need first.",
      "Add access now because the supervisor owns the assignment.",
      "Have a mailbox member forward messages until onboarding finishes.",
      "Add broad department access to prevent future requests.",
    ],
    correctIndex: 0,
    explanation: "Access work should follow onboarding status, approvals, least privilege, and accurate documentation.",
  },
  {
    id: "q7",
    category: "hardware",
    prompt: "You replaced a laptop for a field user who is leaving for a site visit in an hour. What should be verified before handoff?",
    options: [
      "Power, charger, asset label, and basic Windows startup.",
      "Windows login, Outlook access, and wireless connectivity.",
      "Enrollment, encryption, apps/VPN, access, updates, peripherals, and asset record.",
      "User awareness of how to call if something is missing.",
    ],
    correctIndex: 2,
    explanation: "A replacement is not complete until the device is ready for the user's real work and the asset record is clean.",
  },
  {
    id: "q8",
    category: "process",
    prompt: "You need to send a ticket to another department, but you are not fully sure whether Infrastructure or Cybersecurity should own it. What is the best escalation style?",
    options: [
      "Assign it to the team that usually responds fastest.",
      "Send separate tickets to both teams for visibility.",
      "Keep troubleshooting until ownership is completely proven.",
      "Document scope, evidence, uncertainty, and the requested triage decision.",
    ],
    correctIndex: 3,
    explanation: "Good delegation/escalation gives enough context for the next team to act without hiding uncertainty.",
  },
  {
    id: "q9",
    category: "ownership",
    prompt: "You are assigned three tickets: an executive conference-room issue in 30 minutes, a printer problem affecting one user, and a new-hire setup due tomorrow. What is the best approach?",
    options: [
      "Prioritize impact and timing, communicate expectations, and delegate where appropriate.",
      "Work them in received order so the queue stays fair.",
      "Start the new-hire setup because it may take longest.",
      "Ask each user to wait until the queue allows.",
    ],
    correctIndex: 0,
    explanation: "Strong ownership includes prioritization, communication, and appropriate delegation when work conflicts.",
  },
  {
    id: "q10",
    category: "security",
    prompt: "A user asks for local admin rights to install a vendor utility during a live support call. They say their manager already approved the purchase. What should happen next?",
    options: [
      "Grant temporary admin rights and remove them after installation.",
      "Validate need, use approved elevation, and document approval.",
      "Enter IT admin credentials through screen share during installation.",
      "Decline because Field Services should not handle admin rights.",
    ],
    correctIndex: 1,
    explanation: "Least privilege still supports the work, but only through approved install or elevation processes.",
  },
  {
    id: "q11",
    category: "communication",
    prompt: "A user keeps interrupting while you troubleshoot and insists they already tried everything. What is the most professional way to regain control?",
    options: [
      "Explain you must repeat steps because details are often missed.",
      "Ask them to stop interrupting until the checklist is complete.",
      "Acknowledge their work, explain validation, and narrate next steps.",
      "Escalate immediately to prevent the conversation from worsening.",
    ],
    correctIndex: 2,
    explanation: "Difficult conversations go better when you preserve respect while setting a clear troubleshooting structure.",
  },
  {
    id: "q12",
    category: "network",
    prompt: "A VPN user can reach email and Teams, but not one internal file share. Other VPN users can access it. What should you check before sending it to Infrastructure?",
    options: [
      "Permissions, mapped path, DNS, route context, and on-network behavior.",
      "Home internet speed, Wi-Fi strength, and router model.",
      "VPN gateway health and known company-wide outage status.",
      "VPN client reinstall because partial access suggests corruption.",
    ],
    correctIndex: 0,
    explanation: "Partial access for one user needs identity, path/name resolution, and route context before infrastructure escalation.",
  },
  {
    id: "q13",
    category: "process",
    prompt: "The same Teams audio issue appears across several tickets this week. Each fix is quick, but the queue keeps filling. What should you do?",
    options: [
      "Keep resolving each ticket quickly because the fix is known.",
      "Merge the tickets and wait for more reports.",
      "Document the pattern, update knowledge, notify stakeholders, and suggest prevention.",
      "Escalate only the next ticket for another team to decide.",
    ],
    correctIndex: 2,
    explanation: "Repeat work is a signal to improve knowledge, communication, and prevention.",
  },
  {
    id: "q14",
    category: "ownership",
    prompt: "You are onsite and discover the fix requires a spare dock you do not have. The user has meetings all afternoon. What is the best ownership move?",
    options: [
      "Close the ticket as pending parts and move to the next visit.",
      "Explain the issue, arrange a workaround, follow up, and coordinate parts.",
      "Ask the user to reschedule once the correct part is available.",
      "Call another tech and ask them to take over the ticket.",
    ],
    correctIndex: 1,
    explanation: "Ownership means keeping the user moving and making the next step concrete when the first plan fails.",
  },
  {
    id: "q15",
    category: "pc",
    prompt: "A printer works from one application but not another on the same PC. The user needs labels printed before shipping pickup. What should you try first?",
    options: [
      "Reinstall the printer because app-specific printing often means driver issues.",
      "Check app printer settings, label layout, defaults, and workaround output.",
      "Move the user to another workstation and reimage later.",
      "Escalate to the vendor before changing print settings.",
    ],
    correctIndex: 1,
    explanation: "Application-specific printing should start with app settings/output path while protecting the user's immediate business need.",
  },
];

export function levelForScore(score: number) {
  if (score >= 4.5) return "Expert";
  if (score >= 3.75) return "Advanced";
  if (score >= 3) return "Capable";
  if (score >= 2) return "Developing";
  return "Novice";
}

function blendedCategoryScore(selfAverage: number, quizPercent: number | null) {
  const quizScore = quizPercent === null ? selfAverage : (quizPercent / 100) * 5;
  return Math.round((selfAverage * SELF_ASSESSMENT_WEIGHT + quizScore * QUIZ_WEIGHT) * 10) / 10;
}

export function rebalanceResult(result: SubmissionResult): SubmissionResult {
  const categoryScores = result.categoryScores.map((category) => {
    const score = blendedCategoryScore(category.selfAverage, category.quizPercent);
    return {
      ...category,
      score,
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
    const roundedSelfAverage = Math.round(selfAverage * 10) / 10;
    const roundedQuizPercent = quizPercent === null ? null : Math.round(quizPercent * 100);
    const score = blendedCategoryScore(roundedSelfAverage, roundedQuizPercent);

    return {
      key: category.key,
      label: category.label,
      score,
      selfAverage: roundedSelfAverage,
      quizPercent: roundedQuizPercent,
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
