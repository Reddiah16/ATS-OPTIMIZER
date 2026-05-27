export const PREVIEW_META = {
  role: "Senior Software Engineer",
  company: "Stripe",
  resume: "alex_martinez_resume.pdf",
  analyzedAt: "2 min ago",
};

export const PREVIEW_SCORE = {
  overall: 78,
  label: "Good",
  breakdown: [
    { label: "Keywords", score: 28, max: 35, color: "#6172f5" },
    { label: "Skills", score: 22, max: 30, color: "#a78bfa" },
    { label: "Experience", score: 16, max: 20, color: "#34d399" },
    { label: "Formatting", score: 12, max: 15, color: "#fbbf24" },
  ],
};

export const PREVIEW_KEYWORDS = {
  matchPercentage: 72,
  matched: [
    "React",
    "TypeScript",
    "Node.js",
    "REST APIs",
    "AWS",
    "CI/CD",
    "Agile",
    "PostgreSQL",
    "microservices",
    "unit testing",
  ],
  missing: ["Kubernetes", "GraphQL", "Terraform", "gRPC"],
};

export const PREVIEW_SKILLS = {
  matchPercentage: 80,
  matched: [
    "JavaScript",
    "Python",
    "Docker",
    "Git",
    "System Design",
    "API Development",
    "SQL",
    "Redis",
  ],
  missing: ["Kubernetes", "Apache Spark", "Go"],
};

export const PREVIEW_SUGGESTIONS = [
  {
    category: "Quantifiable Achievements",
    original:
      "Led development of payment dashboard used by internal teams.",
    improved:
      "Led development of a payment analytics dashboard adopted by 12 internal teams, reducing report generation time by 40%.",
  },
  {
    category: "Missing Keywords",
    original: "Built backend services for transaction processing.",
    improved:
      "Built Node.js microservices on AWS for high-volume transaction processing with 99.9% uptime.",
  },
  {
    category: "Action Verbs",
    original: "Responsible for code reviews and mentoring juniors.",
    improved:
      "Mentored 4 engineers through structured code reviews, improving sprint velocity by 18%.",
  },
];

export const PREVIEW_STRENGTHS = [
  "Strong alignment with React and TypeScript stack requirements",
  "Clear progression from mid-level to senior engineering roles",
  "Quantified impact in 3 of 5 recent bullet points",
  "Consistent formatting with scannable section headers",
];

export const PREVIEW_WEAKNESSES = [
  "Missing infrastructure keywords: Kubernetes, Terraform",
  "Limited evidence of cross-functional leadership at scale",
  "Summary paragraph is generic — tailor to fintech domain",
];
