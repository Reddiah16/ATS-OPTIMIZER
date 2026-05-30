# ResumeIQ — AI Resume Analyzer & ATS Optimizer

🚀 **[Live Demo Application](https://ats-optimizer-cpgs.vercel.app)**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-success?style=for-the-badge&logo=vercel)](https://ats-optimizer-cpgs.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-F34F29?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)

A production-ready, full-stack enterprise SaaS application that parses and analyzes resumes against job descriptions. It leverages a custom **Domain-Weighted TF Cosine Similarity** ATS scoring engine, automated syntactic **Google X-Y-Z Experience** evaluation, asynchronous **Groq-powered AI feedback (Llama 3.1)**, and rigorous **multi-pillar security hardening**.

---

## ✨ Features

- 🧠 **AI-Powered Semantic & Logical Alignment**: Evaluates seniority fit (Junior, Mid, Senior, Expert), concept mapping, equivalent skill matching, and competency gaps using Llama 3.1.
- 📐 **Domain-Weighted TF Cosine Similarity**: Advanced scoring algorithms that prioritize core engineering skills over general verbs, ensuring high fidelity matches.
- 📊 **Google X-Y-Z Syntactic Bullet Parser**: Syntactically inspects resume experience bullets (*"Accomplished [X] as measured by [Y], by doing [Z]"*) looking for action verbs and quantified impact metrics.
- 🔒 **Multi-Pillar Security Hardening**: Byte-signature magic number inspection, rate limiting with abnormal brute force monitoring hooks, XSS sanitization, and LLM prompt injection guards.
- 📂 **Resume Parsing**: Multi-format support (PDF & DOCX) utilizing deep metadata extraction.
- 🔐 **Sleek Session & Auth Workflow**: Secure registration, email login, and Google OAuth integrations using Supabase Auth and React Context.
- 📈 **Stunning Interactive Analytics**: Gorgeous radar charts, animated score gauges, and high-performance UI styled with Tailwind CSS and Framer Motion.
- 📄 **PDF Report Export**: Export complete ATS scoring breakdowns and AI suggestions to structured PDF files.

---

## 🛠️ Tech Stack

| Layer         | Technology                                          |
|---------------|-----------------------------------------------------|
| **Frontend**  | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend**   | FastAPI, Python 3.11, SQLAlchemy 2.0 (Modern ORM), Alembic |
| **Database**  | PostgreSQL (Neon Serverless Postgres / Local Docker) |
| **Auth**      | Supabase Auth, Google OAuth, JWT Session Tracking   |
| **AI / NLP**  | Groq API (Llama 3.1), AsyncGroq client, Custom NLP Bigram Keyword Engine |
| **Parsing**   | `pdfplumber` (byte parsing), `python-docx` (XML structure parser) |

---

## 📐 Advanced ATS Scoring Engine

The custom engine in `app/services/ats_service.py` evaluates resumes out of **100 total points** across four strictly structured categories:

| Dimension | Weight | Calculation Method |
| :--- | :---: | :--- |
| **Keyword Match** | **35 pts** | **Domain-Weighted Cosine Similarity** between resume and JD keyword vectors. Core tech is weighted at `2.0`, tools/platforms at `1.5`, soft skills at `1.0`, and generic terms at `0.5`. |
| **Skill Match** | **30 pts** | Similarity overlapping of recognized technical and soft skills mapped against a curated 100+ skill taxonomy database (bigrams like `node.js` and `ci/cd` fully supported). |
| **Experience Quality**| **20 pts** | **Google X-Y-Z bullet evaluation** (*Accomplished [X], measured by [Y], by doing [Z]*). Scores bullet points: perfect impact gets `1.0`, action verb without metric gets `0.4`, passive gets `0.1`. Includes action verb diversity bonuses. |
| **Formatting** | **15 pts** | Inspects for section headers, email/phone contact information, LinkedIn presence, and length boundaries. |

---

## 🔒 Enterprise-Grade Security Hardening

ResumeIQ is fully hardened against attack vectors, ensuring production integrity:
1. **Magic Byte Signature Inspection**: Blocks malicious shellcode disguised as documents. The backend verifies the actual starting bytes of the upload (`%PDF-` for PDF, `PK\x03\x04` for DOCX) rather than trusting user-sent file extensions.
2. **AI Prompt Injection Filtering**: Pre-scans text blocks against instruction overrides (e.g. `ignore previous instructions`, `acting as a role`) to guarantee LLM safety.
3. **Sliding-Window Rate Limiter**: Throttles anonymous users by client IP and authenticated users via Bearer token. Triggers active security alert logging if traffic exceeds the limit threshold by 2x.
4. **FastAPI Lock & Statement Timeouts**: Solves database deadlock hangs by applying 3-second statement/lock timeouts during startup Alembic migrations:
   ```python
   conn.execute(text("SET statement_timeout = 3000;"))
   conn.execute(text("SET lock_timeout = 3000;"))
   ```
5. **Cross-Site Scripting (XSS) Sanitization**: HTML escapes and script tags are fully stripped before data rendering.

---

## 📂 Architecture

```
ats-optimizer/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & database startup hooks
│   │   ├── config.py                   # Environment & application settings
│   │   ├── database/
│   │   │   └── session.py              # SQLAlchemy database engine
│   │   ├── middleware/
│   │   │   └── auth.py                 # Route protection middleware
│   │   ├── models/                     # SQLAlchemy relational models
│   │   ├── routers/
│   │   │   ├── auth.py                 # OAuth & credentials registration/login
│   │   │   ├── resume.py               # Resume upload and file stream parser
│   │   │   └── analysis.py             # Advanced ATS analysis orchestrator
│   │   ├── schemas/                    # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── ai_service.py           # AsyncGroq logical semantic Llama engine
│   │   │   ├── ats_service.py          # TF-IDF Cosine Similarity & Google X-Y-Z parser
│   │   │   └── resume_service.py       # Core pdfplumber text extractors
│   │   └── utils/
│   │       ├── security.py             # Signature verifier & prompt injection filter
│   │       └── rate_limiter.py         # Custom sliding window throttling dependency
│   ├── alembic/                        # Database version migrations
│   └── Dockerfile                      # Backend deployment image
│
├── frontend/
│   ├── src/
│   │   ├── app/                        # Next.js App Router tree
│   │   ├── components/
│   │   │   ├── auth/                   # Framer-motion Glassmorphic login forms
│   │   │   ├── upload/                 # Drag-and-drop file upload zones
│   │   │   ├── ATSScoreGauge.tsx       # Gauge widget score trackers
│   │   │   └── ScoreRadarChart.tsx     # Skill radar analytics visualization
│   │   ├── context/
│   │   │   └── AuthContext.tsx         # Supabase global auth context
│   │   └── lib/
│   │       ├── api.ts                  # Axios/Fetch backend communication
│   │       └── supabase.ts             # Supabase web client init
│   └── Dockerfile                      # Frontend deployment image
│
└── docker-compose.yml                  # Full stack container developer setup
```

---

## 🚀 Getting Started

### Prerequisites
* Python 3.11+
* Node.js 20+
* PostgreSQL (Local or Serverless Neon)

### 1. Backend Local Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and supply DATABASE_URL and GROQ_API_KEY

# Perform database migrations
alembic upgrade head

# Launch local secure server
uvicorn app.main:app --reload --port 8000
```
* Swagger Docs live at: `http://localhost:8000/docs`

### 2. Frontend Local Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Set up local env variables
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Run development hot reload server
npm run dev
```
* App available live at: `http://localhost:3000`

### 3. Full-Stack Docker Compose Development
```bash
# Set GROQ_API_KEY in backend/.env
docker-compose up --build
```

---

## 🧪 Unit Tests
The project features a lightweight, lightning-fast test suite asserting the mathematical precision of the Cosine Similarity formulas, X-Y-Z bullet logic, input sanitizers, and sliding rate thresholds:
```bash
cd backend
python -m unittest discover -s app/tests
```

---

## 📄 License
Distributed under the **MIT License**. Feel free to use and adapt this project for your portfolio!
