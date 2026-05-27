# ResumeIQ — AI Resume Analyzer & ATS Optimizer

A production-ready, full-stack SaaS application that analyzes resumes against job descriptions using a custom ATS scoring engine and OpenAI-powered suggestions — built entirely from scratch with no Backend-as-a-Service.

---

## Tech Stack

| Layer         | Technology                                          |
|---------------|-----------------------------------------------------|
| Frontend      | Next.js 14, React 18, TypeScript, Tailwind CSS      |
| Backend       | FastAPI, Python 3.11, SQLAlchemy 2.0                |
| Database      | PostgreSQL + Alembic migrations                     |
| Auth          | JWT (python-jose) + bcrypt password hashing         |
| AI / NLP      | Groq + Llama 3, custom NLP keyword engine       |
| File Parsing  | pdfplumber (PDF), python-docx (DOCX)                |
| Deployment    | Vercel (frontend) + Render/Railway (backend)        |

---

## Architecture

```
ats-optimizer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point, CORS, error handlers
│   │   ├── config.py            # Pydantic settings from .env
│   │   ├── database/
│   │   │   └── session.py       # SQLAlchemy engine, SessionLocal, get_db()
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   └── analysis.py
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   └── analysis.py
│   │   ├── routers/             # FastAPI route handlers
│   │   │   ├── auth.py          # POST /auth/register, /auth/login, GET /auth/me
│   │   │   ├── resume.py        # POST /resumes/upload, GET/DELETE /resumes/{id}
│   │   │   └── analysis.py      # POST /analysis/, GET /analysis/history, /{id}
│   │   ├── services/            # Business logic layer
│   │   │   ├── auth_service.py  # Registration, login, token generation
│   │   │   ├── resume_service.py# File upload, validation, text extraction
│   │   │   ├── ats_service.py   # Custom ATS scoring algorithm
│   │   │   ├── ai_service.py    # OpenAI GPT-4 integration
│   │   │   └── analysis_service.py # Orchestrates full analysis pipeline
│   │   ├── utils/
│   │   │   ├── jwt.py           # Token creation/verification
│   │   │   ├── password.py      # bcrypt hashing
│   │   │   └── file_parser.py   # PDF/DOCX text extraction
│   │   └── middleware/
│   │       └── auth.py          # get_current_user dependency injection
│   ├── alembic/                 # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── render.yaml
│
└── frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router pages
    │   │   ├── page.tsx         # Landing page
    │   │   ├── login/           # Auth pages
    │   │   ├── register/
    │   │   ├── dashboard/       # User dashboard with stats
    │   │   ├── upload/          # Upload + job description form
    │   │   ├── analysis/[id]/   # Full analysis results
    │   │   └── history/         # Paginated analysis history
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── ATSScoreGauge.tsx # Animated SVG score gauge
    │   │   ├── KeywordAnalysis.tsx
    │   │   └── AISuggestions.tsx
    │   ├── lib/
    │   │   ├── api.ts           # Axios client with auth interceptors
    │   │   └── auth.tsx         # Auth context provider + useAuth hook
    │   └── types/               # TypeScript interfaces
    ├── package.json
    ├── tailwind.config.js
    └── vercel.json
```

---

## ATS Scoring Algorithm

The custom scoring engine in `app/services/ats_service.py` scores resumes on **four dimensions** (100 points total):

| Dimension         | Weight | How it's calculated                                             |
|-------------------|--------|-----------------------------------------------------------------|
| Keyword Match     | 35 pts | NLP keyword overlap between resume and job description          |
| Skill Match       | 30 pts | Recognized tech/soft skills from a curated 100+ skill database  |
| Experience Quality| 20 pts | Quantifiable achievements (%, $, numbers) + action verb density |
| Formatting        | 15 pts | Section headers, contact info, length quality, LinkedIn presence |

The engine uses:
- **Bigram extraction** for multi-word skills (e.g. "node.js", "ci/cd")
- **Whole-word regex matching** to avoid false positives
- **Stop word filtering** for 100+ common English words
- **Tech skills database** across 6 categories (programming, web, data, cloud, tools, soft)

---

## AI Features (OpenAI GPT-4o-mini)

1. **Resume Feedback** — Structured JSON response with:
   - 3–5 strengths and weaknesses
   - 4–6 categorized improvement suggestions
   - 2–4 AI-rewritten bullet points with before/after

2. **Bullet Point Rewriter** — Transforms weak bullets like *"Worked on APIs"* into *"Developed 12 RESTful APIs using FastAPI and PostgreSQL, reducing average response time by 40%"*

3. **Cover Letter Generator** — Tailored cover letter from resume + job description (bonus endpoint)

---

## API Reference

### Authentication
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/api/v1/auth/register` | Register new user      |
| POST   | `/api/v1/auth/login`    | Login, get JWT token   |
| GET    | `/api/v1/auth/me`       | Get current user       |

### Resumes
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| POST   | `/api/v1/resumes/upload`    | Upload PDF/DOCX resume    |
| GET    | `/api/v1/resumes/`          | List user's resumes       |
| GET    | `/api/v1/resumes/{id}`      | Get resume by ID          |
| DELETE | `/api/v1/resumes/{id}`      | Delete resume             |

### Analysis
| Method | Endpoint                       | Description                     |
|--------|--------------------------------|---------------------------------|
| POST   | `/api/v1/analysis/`            | Run full ATS analysis           |
| GET    | `/api/v1/analysis/history`     | Get paginated history           |
| GET    | `/api/v1/analysis/{id}`        | Get analysis by ID              |

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL (or Docker)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and fill env vars
cp .env.example .env
# Edit .env: set DATABASE_URL and GROQ_API_KEY

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start dev server
npm run dev
```

App available at: http://localhost:3000

### 3. Docker Compose (Full Stack)

```bash
# From project root
cp backend/.env.example backend/.env
# Set OPENAI_API_KEY in backend/.env

docker-compose up --build
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ats_optimizer
SECRET_KEY=your-32+-character-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OPENAI_API_KEY=sk-...
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your Render/Railway backend URL
```

### Backend → Render

1. Push to GitHub
2. Create new Render Web Service, connect repo
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard
6. Create a PostgreSQL database on Render (free tier) and set `DATABASE_URL`

### Database → Neon (Serverless Postgres)

1. Sign up at neon.tech
2. Create a new project
3. Copy the connection string to `DATABASE_URL`
4. Run migrations: `alembic upgrade head`

---

## Security Implementation

- **JWT authentication** — HS256 signed tokens with expiry
- **bcrypt password hashing** — salted, work factor 12
- **Protected routes** — `get_current_user` FastAPI dependency on all auth routes
- **CORS configuration** — Whitelist-only origins
- **File validation** — Extension checking + size limiting (10 MB)
- **SQL injection prevention** — SQLAlchemy ORM parameterized queries
- **Environment variables** — No secrets in source code

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Resumes
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,          -- stored unique name
    original_filename VARCHAR(255) NOT NULL, -- user's original name
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,          -- 'pdf' or 'docx'
    extracted_text TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses
CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    job_title VARCHAR(255),
    job_description TEXT NOT NULL,
    ats_score FLOAT NOT NULL,
    keyword_score FLOAT,
    skill_score FLOAT,
    experience_score FLOAT,
    formatting_score FLOAT,
    matched_keywords JSON,
    missing_keywords JSON,
    all_job_keywords JSON,
    matched_skills JSON,
    missing_skills JSON,
    ai_feedback JSON,
    improved_bullets JSON,
    strengths JSON,
    weaknesses JSON,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Optional Advanced Features

The codebase is architected to easily support:

- **Cover Letter Generation** — `ai_service.generate_cover_letter()` already implemented
- **Interview Question Generation** — Add `POST /analysis/{id}/interview-questions` endpoint
- **Skill Gap Analysis** — Cross-reference missing skills with learning resources
- **Multi-Job Comparison** — Compare ATS scores across multiple job descriptions
- **Resume PDF Export** — Use `reportlab` or `weasyprint` to export reports
- **Recruiter Dashboard** — Add `role` field to users, scope recruiter views

---

## License

MIT — feel free to use this as a portfolio project or extend it.
