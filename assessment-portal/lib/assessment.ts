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
    prompt: "A dispatcher says their Windows laptop is almost unusable for the first 15 minutes after login, but works normally later in the day. What is the strongest next step?",
    options: [
      "Gather recent-change details and compare startup items, resource usage, disk health, update activity, and whether the behavior follows the user profile.",
      "Reimage the laptop if the user needs a fast resolution and there are no obvious hardware errors.",
      "Disable several startup apps now and ask the user to report back tomorrow.",
      "Run vendor hardware diagnostics before looking at the Windows session or user profile.",
    ],
    correctIndex: 0,
    explanation: "The symptom has a pattern, so the best response is to collect evidence and isolate startup/profile/update causes before changing the device.",
  },
  {
    id: "q2",
    category: "network",
    prompt: "A small group moved desks this morning. Wired network is down for that row, Wi-Fi works, and nearby unmoved users are fine. What information should go to Infrastructure if you escalate?",
    options: [
      "The affected users' names, confirmation they rebooted, and a request to check the network.",
      "A screenshot of the browser error plus the users' current desk numbers.",
      "Whether the issue happens on one app or all apps, and whether the users can sign in elsewhere.",
      "Affected jack/port locations, wired-only scope, patch/cable checks, IP/VLAN observations if available, timing of the move, and what remote-hands help is needed.",
    ],
    correctIndex: 3,
    explanation: "Infrastructure escalations are strongest when they include physical scope, network observations, and a clear remote-hands ask.",
  },
  {
    id: "q3",
    category: "communication",
    prompt: "An upset manager says, “This has been open for three days and nobody in IT cares.” You can see the ticket is waiting on a vendor. What is the best response?",
    options: [
      "Explain that the vendor owns the delay and there is nothing IT can do until they respond.",
      "Acknowledge the frustration, summarize the current owner and blocker, give the next follow-up time, and offer any workaround or escalation path.",
      "Send the full vendor thread so the manager can see IT has been working on it.",
      "Move the ticket priority higher so the manager can see it was escalated.",
    ],
    correctIndex: 1,
    explanation: "Difficult-user situations need ownership, clear expectations, and calm communication rather than defensiveness.",
  },
  {
    id: "q4",
    category: "software",
    prompt: "A line-of-business app crashes only for one user. It works for other users on the same PC, and the same user has the issue on a second PC. Where should you focus first?",
    options: [
      "Reinstall the app on the original PC and clear Windows temporary files.",
      "Check the network path and firewall rules used by that office.",
      "Look at the user's permissions, licensing, profile/app data, and account-specific configuration.",
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
      "Reset the password, confirm the user can sign in, and monitor for another report.",
      "Tell the user to deny future prompts and submit a ticket if it happens again.",
      "Remove MFA from the account temporarily so the user can keep working.",
      "Follow the account-compromise process: contain the account as approved, preserve details, document evidence, and escalate to Cybersecurity for review.",
    ],
    correctIndex: 3,
    explanation: "Suspicious MFA activity is security-sensitive and should be contained and elevated to Cybersecurity through the approved process.",
  },
  {
    id: "q6",
    category: "identity",
    prompt: "A supervisor asks you to add a new employee to several shared mailboxes and a restricted application group before HR onboarding is fully complete. What should you do?",
    options: [
      "Verify the onboarding status, required approvals, exact groups/permission levels, and business need before making only approved changes.",
      "Add the access now because the supervisor owns the employee's work assignment.",
      "Ask another mailbox member to forward anything important until the new employee starts.",
      "Add the broadest department group so the employee does not have to submit more requests later.",
    ],
    correctIndex: 0,
    explanation: "Access work should follow onboarding status, approvals, least privilege, and accurate documentation.",
  },
  {
    id: "q7",
    category: "hardware",
    prompt: "You replaced a laptop for a field user who is leaving for a site visit in an hour. What should be verified before handoff?",
    options: [
      "That the device powers on, has a charger, and is labeled correctly.",
      "That Windows login works and the user can open Outlook.",
      "Enrollment, encryption, required apps/VPN, user sign-in, data/access needs, updates, peripherals, and asset record.",
      "That the user knows to call the desk if something is missing later.",
    ],
    correctIndex: 2,
    explanation: "A replacement is not complete until the device is ready for the user's real work and the asset record is clean.",
  },
  {
    id: "q8",
    category: "process",
    prompt: "You need to send a ticket to another department, but you are not fully sure whether Infrastructure or Cybersecurity should own it. What is the best escalation style?",
    options: [
      "Assign it to the team that usually responds fastest and let them reroute it if needed.",
      "Send it to both teams separately so one of them picks it up.",
      "Keep troubleshooting until you can prove the owning team beyond doubt.",
      "Document impact, scope, evidence, steps tried, why ownership is unclear, and a specific request for triage/next ownership.",
    ],
    correctIndex: 3,
    explanation: "Good delegation/escalation gives enough context for the next team to act without hiding uncertainty.",
  },
  {
    id: "q9",
    category: "ownership",
    prompt: "You are assigned three tickets: an executive conference-room issue in 30 minutes, a printer problem affecting one user, and a new-hire setup due tomorrow. What is the best approach?",
    options: [
      "Prioritize by business impact and timing, communicate expectations, delegate or schedule lower-risk work if appropriate, and keep tickets updated.",
      "Work them in the order received so the queue stays fair.",
      "Start the new-hire setup first because it likely takes the longest.",
      "Ask the users to wait until you can get through the queue.",
    ],
    correctIndex: 0,
    explanation: "Strong ownership includes prioritization, communication, and appropriate delegation when work conflicts.",
  },
  {
    id: "q10",
    category: "security",
    prompt: "A user asks for local admin rights to install a vendor utility during a live support call. They say their manager already approved the purchase. What should happen next?",
    options: [
      "Grant temporary admin rights during the call and remove them when the install is complete.",
      "Validate business need, use approved installation or temporary elevation process, document approval, and avoid unnecessary privilege.",
      "Have the user share their screen and enter an IT admin credential so they never learn the password.",
      "Decline the request because Field Services should not assist with admin rights.",
    ],
    correctIndex: 1,
    explanation: "Least privilege still supports the work, but only through approved install or elevation processes.",
  },
  {
    id: "q11",
    category: "communication",
    prompt: "A user keeps interrupting while you troubleshoot and insists they already tried everything. What is the most professional way to regain control?",
    options: [
      "Tell them you need to repeat steps because users often miss details.",
      "Ask them to stop interrupting so you can finish the checklist.",
      "Acknowledge what they tried, explain the specific reason you need to validate a few items, and narrate your next steps briefly.",
      "Escalate immediately to avoid making the user more frustrated.",
    ],
    correctIndex: 2,
    explanation: "Difficult conversations go better when you preserve respect while setting a clear troubleshooting structure.",
  },
  {
    id: "q12",
    category: "network",
    prompt: "A VPN user can reach email and Teams, but not one internal file share. Other VPN users can access it. What should you check before sending it to Infrastructure?",
    options: [
      "User/group permissions, mapped path, DNS/name resolution for that share, VPN route context, and whether the same user can access it on-network.",
      "The user's home internet speed and Wi-Fi signal strength.",
      "Whether all VPN gateways are online and if there is a known company-wide outage.",
      "Reinstall the VPN client because partial access usually means a corrupt client.",
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
      "Merge the tickets and wait to see if more users report it.",
      "Document the pattern, confirm the common cause/fix, publish or update the knowledge article, notify the right stakeholders, and suggest prevention.",
      "Escalate only the next ticket so another team can decide if it matters.",
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
      "Explain the miss, arrange a practical workaround or loaner path, set a specific follow-up, update the ticket, and coordinate the part.",
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
      "Reinstall the printer completely because application-specific printing usually points to a bad driver.",
      "Check the affected app's printer selection, page/label settings, default printer behavior, and test another output path while preserving a workaround.",
      "Move the user to another workstation and reimage this PC later.",
      "Escalate to the app vendor before changing print settings.",
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
