# 📊 Q&A Data Analysis Agent

This project runs as a split application:
- a FastAPI backend that exposes dataset upload, question answering, history, and health endpoints
- a React + Tailwind frontend that provides the user interface for dataset selection, chat-style question entry, and result rendering

The core analysis pipeline remains grounded in real pandas execution inside a sandboxed Python environment, so answers are computed from the uploaded dataset rather than guessed by the model.

## 🚀 Quick Start

### Option 1: Local Development (without Docker)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- A Groq API key in the environment or in a local .env file

### 2. Configure environment
Create or update `.env` with your Groq key:

```env
GROQ_API_KEY=your_key_here
```

### 3. Install dependencies

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd frontend
npm install
```

### 4. Run the app

Option A: Start both services manually

```bash
# backend
uvicorn api:app --host 0.0.0.0 --port 8000

# frontend (separate terminal)
cd frontend
npm run dev -- --host 0.0.0.0 --port 5174
```

Option B: Use the Windows launcher

```bat
run.bat
```

The React UI should open at http://localhost:5174 and call the FastAPI backend at http://localhost:8000.

---

### Option 2: Docker Development

### 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- A valid `GROQ_API_KEY` from [Groq Console](https://console.groq.com/)

### 2. Configure environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Build and run

```bash
docker compose up -d
```

### 4. Access

- **Application UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🧠 Architecture

- Backend: [api.py](api.py) and [src/analysis_service.py](src/analysis_service.py)
- Core agent pipeline: [src/agent.py](src/agent.py), [src/sandbox.py](src/sandbox.py), [src/code_generator.py](src/code_generator.py)
- Frontend: [frontend/src](frontend/src)

The API exposes:
- POST /upload
- POST /query
- GET /history
- GET /health
- GET /datasets and GET /datasets/{dataset_id}
- POST /api/export/pdf (PDF report generation)
- Authentication: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me

## 🔒 Security & persistence
- Sandbox validation remains in [src/sandbox.py](src/sandbox.py)
- SQLite logging continues through [src/sqlite_logging.py](src/sqlite_logging.py)
- PostgreSQL (Neon) for user authentication
- Secrets stay in `.env` and are ignored by git via [.gitignore](.gitignore)

## ✅ Verification
Run the regression suite:

```bash
python -m unittest discover -s tests
```

Build the frontend:

```bash
cd frontend
npm run build
```

---

## 🐳 Docker Documentation

See [docs/docker.md](docs/docker.md) for complete Docker deployment guide including:
- Local development with Docker Compose
- Production deployment to Render
- Environment variables reference
- Volume management
- Troubleshooting

---

## 🗄️ Database

- **Neon PostgreSQL**: User authentication (users table) - production database
- **SQLite**: Interaction logging (logs/agent_logs.db) - local development only

---

## 📦 Features

- **Dataset Upload**: CSV/Excel files up to 50MB
- **Natural Language Queries**: Ask questions about your data
- **Chart Generation**: Automatic visualization (matplotlib)
- **PDF Export**: Generate analysis reports (ReportLab)
- **Authentication**: JWT-based with register/login/logout
- **History**: Query history with replay
- **Data Profiling**: Automatic dataset analysis
- **Data Cleaning**: Automated data quality improvements

---

## 📚 Documentation

- [Docker Deployment Guide](docs/docker.md)
- [Frontend Architecture](docs/frontend.md)
- [Database Setup](docs/database.md)
- [Numbers Note](docs/numbers_note.md)
- [Sample Questions](docs/sample_questions.md)