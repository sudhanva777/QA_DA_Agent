# Q&A Data Analysis Agent - Project Architecture & Workflow Documentation

## Overview

This project is a **split-architecture AI-powered data analysis platform** that enables users to upload CSV/Excel datasets and ask natural language questions about their data. The system executes real pandas code in a sandboxed environment, ensuring zero hallucinated numbers.

### Core Philosophy
- **Grounded answers**: All numerical results come from actual pandas execution, not LLM generation
- **Sandboxed execution**: Code runs in a restricted environment with timeout and import blocking
- **Caching & profiling**: Automatic dataset intelligence (profiling, quality scoring, insights) computed once and cached
- **Authentication**: JWT-based auth with PostgreSQL (Neon) for users, SQLite for interaction logging

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite + Tailwind)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │  Landing    │  │  Dashboard  │  │   Chat      │  │   Settings/     │   │
│  │  Page       │  │  (Datasets) │  │  Workspace  │  │   Profile       │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │
│         │                │                │                    │            │
│         └────────────────┼────────────────┼────────────────────┘            │
│                          ▼                ▼                                  │
│                   ┌──────────────────────────────┐                          │
│                   │     API Service Layer        │                          │
│                   │  (services/api.js - Axios)   │                          │
│                   └──────────────┬───────────────┘                          │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │ HTTP/REST + WebSocket (future)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI + Uvicorn)                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      api.py (Main Entry Point)                      │   │
│  │  • CORS, Static Files (/outputs), Exception Handlers               │   │
│  │  • Auth Router (/api/auth/*)                                       │   │
│  │  • Dataset Endpoints: /upload, /datasets, /datasets/{id}           │   │
│  │  • Query Endpoint: /query (core Q&A)                               │   │
│  │  • Analysis Endpoints: /profile, /quality, /insights, /clean       │   │
│  │  • Export: /export/pdf                                              │   │
│  │  • History: /history                                                │   │
│  └──────────────────────────┬──────────────────────────────────────────┘   │
│                             │                                               │
│         ┌───────────────────┼───────────────────┐                          │
│         ▼                   ▼                   ▼                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│  │ analysis_   │    │   agent.py  │    │  auth/      │                   │
│  │ service.py  │    │  (Pipeline) │    │  routes.py  │                   │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                   │
│         │                  │                  │                            │
│         │         ┌────────┴────────┐         │                            │
│         │         ▼                 ▼         │                            │
│         │  ┌─────────┐         ┌─────────┐    │                            │
│         │  │code_gen │         │ sandbox │    │                            │
│         │  │erator.py│         │  .py    │    │                            │
│         │  └────┬────┘         └────┬────┘    │                            │
│         │       │                   │          │                            │
│         ▼       ▼                   ▼          ▼                            │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │              SUPPORTING MODULES (src/)                          │      │
│  │  data_loader.py  data_profiler.py  data_validator.py           │      │
│  │  quality_score.py  data_cleaner.py  insight_generator.py       │      │
│  │  chart_selector.py  dataset_summary.py  cache_store.py         │      │
│  │  answer_composer.py  analysis_planner.py  sqlite_logging.py    │      │
│  │  db/postgresql.py  schemas/  prompts.py  config.py             │      │
│  └─────────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌───────────────┐           ┌───────────────┐
            │  PostgreSQL   │           │    SQLite     │
            │  (Neon Cloud) │           │ (logs/agent_  │
            │  - users table│           │  logs.db)     │
            └───────────────┘           └───────────────┘
```

---

## Backend Components

### 1. `api.py` - FastAPI Application Entry Point

**Responsibilities:**
- FastAPI app initialization with CORS, static file serving, exception handlers
- Route registration (auth, dataset, query, analysis, export, history)
- PostgreSQL & SQLite initialization
- Environment configuration (ALLOWED_ORIGINS, ENABLE_OPENAPI_DOCS)

**Key Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with model info |
| `/datasets` | GET | List uploaded datasets with metadata |
| `/datasets/{id}` | GET | Dataset details, preview, quality, insights |
| `/datasets/{id}` | DELETE | Remove dataset |
| `/upload` | POST | Upload CSV/Excel (max 50MB) |
| `/query` | POST | Core Q&A - natural language → answer |
| `/history` | GET | Interaction history from SQLite |
| `/profile/{id}` | GET | Full data profiling report |
| `/quality/{id}` | GET | Quality score & validation issues |
| `/insights/{id}` | GET | Auto-generated insights |
| `/clean` | POST | Dataset cleaning operations |
| `/summary/{id}` | GET | Rich LLM-ready dataset summary |
| `/export/pdf` | POST | Generate PDF report (auth required) |
| `/api/auth/*` | POST/GET | Register, login, logout, me |

---

### 2. `src/analysis_service.py` - Business Logic Layer

**Core Functions:**

#### Dataset Management
- `list_datasets()` - Scan `data/` directory for CSV/XLSX files
- `get_dataset_path(dataset_id)` - Validate & resolve to file path
- `upload_dataset_file()` - Persist upload, compute intelligence, cache
- `delete_dataset_file()` - Remove file from disk
- `get_dataset_details()` - Full metadata + preview + quality + insights

#### Dataset Intelligence (Cached)
- `compute_dataset_intelligence()` - Runs profiler, validator, quality scorer, insight generator
- `get_or_load_dataset_intelligence()` - Cache-first retrieval (keyed by file path + mtime)
- Cache: `src/cache_store.py` - JSON file-based with TTL

#### Analysis Endpoints
- `get_dataset_profile()` - Comprehensive profiling report
- `get_dataset_quality()` - Quality score (0-100) + validation issues
- `get_dataset_insights()` - Automated insights (correlations, trends, outliers)
- `clean_dataset_file()` - Sandboxed cleaning operations
- `get_summary()` - Rich text summary for LLM context

#### Core Q&A Pipeline
```python
def answer_question(dataset_id: str, question: str) -> dict:
    1. Load dataset & intelligence (cached)
    2. Build rich schema summary (build_rich_dataset_summary)
    3. Call agent.answer_question(question, df, rich_summary)
    4. Format result for UI (table payload + chart payload)
    5. Log interaction to SQLite
    6. Return structured response
```

---

### 3. `src/agent.py` - Core Agent Pipeline

**Pipeline Flow:**
```
User Question + DataFrame + Schema Summary
         │
         ▼
┌─────────────────────────────────────┐
│  create_analysis_plan() (optional)  │ ← Feature flag: ENABLE_PLANNER
│  Returns structured execution plan  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  generate_code() → Groq LLM         │
│  Returns: {reasoning, code, chart}  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  validate_code() → AST parsing      │
│  Blocks: imports, eval, exec,       │
│  dunder attrs, blocked functions    │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  run_code() → Threaded execution    │
│  • 10s timeout watchdog             │
│  • Restricted globals (pd, np, plt) │
│  • Result capped at 1000 rows       │
│  • Auto-fix matplotlib bar charts   │
│  • One retry on execution error     │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  compose_answer() → Groq LLM        │
│  Grounded on ACTUAL computed result │
│  Natural language, no jargon        │
└─────────────────────────────────────┘
         │
         ▼
   Structured Response
```

**Key Features:**
- **Self-correction**: One retry with error feedback to LLM
- **Chart deduplication**: Unique filenames via UUID
- **Tabular enforcement**: Scalars wrapped as DataFrame for consistent rendering
- **Analysis plan**: Optional pre-planning step (feature-flagged)

---

### 4. `src/sandbox.py` - Hardened Code Execution

**Security Layers:**

1. **AST Validation** (`validate_code`):
   - Blocks: `import`, `eval`, `exec`, `open`, `__import__`, `compile`
   - Blocks: `getattr`, `setattr`, `globals`, `locals`, `vars`
   - Blocks: Walrus operator (`:=`), dunder attribute access
   - Rejects any `ast.Import` / `ast.ImportFrom`

2. **Restricted Execution Environment** (`run_code`):
   ```python
   safe_globals = {
       "__builtins__": {len, round, sorted, sum, min, max, str, int, float,
                        list, dict, range, abs, True, False, None, print,
                        bool, tuple, enumerate, zip, isinstance, ...},
       "pd": pandas, "np": numpy, "plt": matplotlib.pyplot
   }
   safe_locals = {"df": df.copy()}  # DataFrame copy per execution
   ```

3. **Execution Watchdog**:
   - Thread-based with 10-second timeout
   - Returns timeout error if exceeded

4. **Result Capping**:
   - DataFrames/Series truncated to 1000 rows

5. **Matplotlib Safety**:
   - Monkey-patches `plt.bar`/`plt.barh` to handle categorical x-values
   - Auto-converts string labels to numeric positions + `plt.xticks()`

---

### 5. `src/code_generator.py` - LLM → Pandas Code

**Prompt Strategy** (`src/prompts.py`):
- System prompt enforces: JSON output, pandas-only, result variable, chart logic
- Examples for: comparison (bar), trend (line), single-fact (no chart)
- **Date Conversion Rule**: Auto-convert text dates with `pd.to_datetime()`
- **Chart Logic**: `needs_chart=true` for comparisons, trends, proportions, distributions

**Retry Mechanism**: On execution error, re-prompts with error message for self-correction.

---

### 6. `src/answer_composer.py` - Grounded Natural Language Answers

**Prompt Strategy**:
- Receives: question, reasoning, **actual computed result**
- Rules: Use ONLY provided numbers, plain English, no pandas jargon
- Formats large tables (truncates to 50 rows for token efficiency)

---

### 7. `src/analysis_planner.py` - Optional Pre-Planning

**Feature Flag**: `ENABLE_PLANNER=true`

**Planner Output**:
```json
{
  "intent": "aggregation|comparison|trend|filtering|correlation|distribution",
  "relevant_columns": ["col1", "col2"],
  "need_cleaning": boolean,
  "need_aggregation": boolean,
  "need_statistical_analysis": boolean,
  "need_visualization": boolean,
  "chart_type_recommendation": "bar|line|scatter|pie|box|none",
  "plan_summary": "Step-by-step technical plan"
}
```

---

### 8. Data Processing Modules

| Module | Purpose |
|--------|---------|
| `data_loader.py` | Load CSV/Excel (UTF-8 → latin-1 fallback), build schema summary |
| `data_profiler.py` | Exhaustive profiling: stats, correlations, special column detection, type inference |
| `data_validator.py` | Quality issues: nulls, duplicates, constants, outliers (IQR/Z-score), whitespace, mixed casing, unparsed dates/numerics |
| `quality_score.py` | Computes 0-100 quality score from validation issues |
| `data_cleaner.py` | Sandbox-executed cleaning: trim, case normalize, date parse, numeric parse, dedupe |
| `insight_generator.py` | Auto-insights: correlations, trends, outliers, distributions, category imbalances |
| `chart_selector.py` | Smart Recharts payload: bar/line/scatter/pie/box based on data shape |
| `dataset_summary.py` | Rich text summary for LLM context (profile + quality + schema) |

---

### 9. Authentication (`src/auth/`)

| File | Purpose |
|------|---------|
| `routes.py` | Register, login, logout, me endpoints |
| `dependencies.py` | `get_current_user` - JWT verification via PostgreSQL |
| `schemas/auth.py` | Pydantic models for auth requests/responses |

**Flow**: Register → bcrypt hash → PostgreSQL → JWT token → Cookie-based auth

---

### 10. Logging & Persistence

| Component | Storage | Purpose |
|-----------|---------|---------|
| `sqlite_logging.py` | `logs/agent_logs.db` | Interaction logs: question, code, result, chart, latency, status |
| `db/postgresql.py` | Neon PostgreSQL | User accounts, password hashes |
| `cache_store.py` | `logs/cache/*.json` | Dataset intelligence cache (keyed by path + mtime) |

---

## Frontend Architecture

### Tech Stack
- **React 18** + **Vite** + **Tailwind CSS**
- **Recharts** for visualizations
- **React Router** for navigation
- **Axios** for API calls
- **Three.js** (HeroScene) for landing page animation

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `App.jsx` | Root | Routes, auth context, layout |
| `Landing.jsx` | Page | Marketing landing with hero animation |
| `Dashboard.jsx` | Page | Dataset list, upload, selection |
| `ChatWorkspace.jsx` | Page | Main Q&A interface |
| `ChatWorkspace.jsx` | Component | Chat messages, code viewer, chart viewer, table |
| `DataTable.jsx` | Component | Sortable, paginated data table |
| `ChartViewer.jsx` | Component | Recharts rendering + fallback to image |
| `CodeBlock.jsx` | Component | Syntax-highlighted generated code |
| `InsightsPanel.jsx` | Component | Auto-insights display |
| `DataProfileView.jsx` | Component | Full profiling report UI |
| `QualityHeader.jsx` / `TransparencyBanner.jsx` | Components | Quality score badges |
| `CleaningModal.jsx` | Component | Dataset cleaning operations UI |
| `Sidebar.jsx` | Component | Navigation, history, dataset switcher |
| `AuthContext.jsx` | Context | User state, login/logout, token management |

### API Service Layer (`frontend/src/services/api.js`)
- Axios instance with base URL
- Request/response interceptors for auth tokens
- Methods for all backend endpoints

---

## Data Flow: End-to-End Example

### User Asks: "Which region had the highest total sales?"

```
1. FRONTEND: User types question in ChatWorkspace
                    │
                    ▼
2. API CALL: POST /query {dataset_id, question}
                    │
                    ▼
3. BACKEND (analysis_service.answer_question):
   - Load dataset from data/
   - Get cached intelligence (profile, quality, insights)
   - Build rich schema summary
                    │
                    ▼
4. AGENT PIPELINE (agent.answer_question):
   a) [Optional] create_analysis_plan() → structured plan
   b) generate_code() → Groq LLM returns:
      {
        "reasoning": "Compute total sales by region...",
        "code": "result = df.groupby('Region')['Sales'].sum()...",
        "needs_chart": true
      }
   c) validate_code() → AST check (passes)
   d) run_code() → Executes in sandbox:
      - Thread with 10s timeout
      - Restricted globals (pd, np, plt)
      - Returns: {result: Series, chart_path: "outputs/chart_xyz.png"}
   e) [Retry if error] → One self-correction attempt
   f) compose_answer() → Groq LLM returns natural language:
      "The West region generated the highest total sales at $3,597,550..."
                    │
                    ▼
5. FORMAT FOR UI:
   - format_table_result() → {columns, rows, shape}
   - build_chart_payload() → Recharts config (bar chart)
   - chart_url → "/outputs/chart_xyz.png"
                    │
                    ▼
6. LOG TO SQLITE: Full interaction record
                    │
                    ▼
7. RESPONSE TO FRONTEND:
{
  "status": "success",
  "answer": "The West region generated...",
  "table": {...},
  "chart_url": "/outputs/chart_xyz.png",
  "chart_data": {...},
  "generated_code": "...",
  "latency_ms": 1245.32
}
                    │
                    ▼
8. FRONTEND RENDERS:
   - MessageCard: Answer text
   - ChartViewer: Recharts bar chart (or image fallback)
   - DataTable: Sortable results table
   - CodeBlock: Generated pandas code (collapsible)
```

---

## Configuration & Environment

### Required Environment Variables
```env
GROQ_API_KEY=gsk_xxx              # Required - Groq API key
GROQ_MODEL=openai/gpt-oss-120b    # Optional - Model override
ALLOWED_ORIGINS=http://localhost:5174,http://localhost:3000
ENABLE_OPENAPI_DOCS=true
ENABLE_PLANNER=false              # Feature flag for analysis planner
```

### Docker Deployment
- `docker-compose.yml` - Multi-service: backend, frontend, nginx
- `Dockerfile` - Python backend image
- `frontend/Dockerfile` - Node build + nginx serve
- `nginx.conf` / `nginx-main.conf` - Reverse proxy config
- `render.yaml` - Render.com deployment config

---

## Testing

### Test Structure (`tests/`)
| Test File | Coverage |
|-----------|----------|
| `test_analysis_service.py` | Dataset upload, query, profile, quality, insights |
| `test_analysis_planner.py` | Planner enabled/disabled, fallback |
| `test_agent.py` | Agent pipeline integration |
| `test_sandbox.py` | Sandbox validation, execution, timeout, matplotlib |
| `test_code_generator.py` | Code generation, retry logic |
| `test_data_cleaner.py` | Cleaning operations |
| `test_data_profiler.py` | Profiling accuracy |
| `test_data_validator.py` | Validation issue detection |
| `test_quality_score.py` | Scoring algorithm |
| `test_insight_generator.py` | Insight generation |
| `test_chart_selector.py` | Chart type selection |
| `test_dataset_summary.py` | Summary building |
| `test_auth_e2e.py` | Auth flow |
| `test_api_e2e.py` | Full API integration |

**Run**: `python -m unittest discover -s tests`

---

## Security Considerations

1. **Code Execution Sandbox**: AST validation + restricted globals + thread timeout
2. **No Imports Allowed**: LLM cannot import arbitrary modules
3. **File Upload Validation**: Extension check, 50MB limit, path traversal prevention
4. **SQL Injection**: Parameterized queries via SQLAlchemy/PostgreSQL
5. **Authentication**: JWT with HttpOnly cookies, bcrypt password hashing
6. **CORS**: Configurable allowed origins
7. **Rate Limiting**: Not implemented (consider for production)

---

## Performance Optimizations

1. **Dataset Intelligence Caching**: Computed once per file (keyed by path + mtime)
2. **Result Capping**: 1000 rows max from sandbox, 50 rows for LLM answer composition
3. **Schema Summary Truncation**: Capped at ~6000 chars (~1500 tokens)
4. **Static File Serving**: Charts served directly via `/outputs/` mount
5. **Connection Pooling**: PostgreSQL via SQLAlchemy engine

---

## Extending the System

### Adding New Analysis Endpoints
1. Add function in `analysis_service.py`
2. Add route in `api.py` (both `/endpoint` and `/api/endpoint` aliases)
3. Add frontend service method in `api.js`
4. Create UI component

### Adding New Chart Types
1. Extend `chart_selector.py` with new Recharts config
2. Update `CODE_GEN_SYSTEM_PROMPT` with new chart example
3. Test sandbox matplotlib compatibility

### Enabling Planner
```bash
export ENABLE_PLANNER=true
# Restart backend
```

---

## File Structure Summary

```
QA_DA_Agent/
├── api.py                    # FastAPI app, all routes
├── main.py                   # CLI entry point (REPL mode)
├── requirements.txt          # Python dependencies
├── docker-compose.yml        # Docker orchestration
├── Dockerfile                # Backend image
├── render.yaml               # Render deployment
├── supervisord.conf          # Process manager (Docker)
├── nginx.conf / nginx-main.conf
├── alembic/                  # PostgreSQL migrations
├── data/                     # Uploaded datasets (gitignored)
├── outputs/                  # Generated charts (gitignored)
├── logs/                     # SQLite DB + cache (gitignored)
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level pages
│   │   ├── services/         # API client
│   │   ├── context/          # React contexts
│   │   └── App.jsx           # Routes & layout
│   └── package.json
├── src/                      # Backend Python modules
│   ├── agent.py              # Core pipeline
│   ├── analysis_service.py   # Business logic
│   ├── sandbox.py            # Hardened execution
│   ├── code_generator.py     # LLM → code
│   ├── answer_composer.py    # LLM → answer
│   ├── analysis_planner.py   # Optional pre-planning
│   ├── data_loader.py        # CSV/Excel loading
│   ├── data_profiler.py      # Profiling
│   ├── data_validator.py     # Validation
│   ├── quality_score.py      # Scoring
│   ├── data_cleaner.py       # Cleaning
│   ├── insight_generator.py  # Auto-insights
│   ├── chart_selector.py     # Chart config
│   ├── dataset_summary.py    # Rich summaries
│   ├── cache_store.py        # File-based cache
│   ├── sqlite_logging.py     # Interaction logging
│   ├── config.py             # Groq client
│   ├── prompts.py            # System prompts
│   ├── auth/                 # Auth module
│   ├── db/                   # PostgreSQL
│   └── schemas/              # Pydantic models
├── tests/                    # Unit & integration tests
└── docs/                     # Additional documentation
```

---

## Quick Reference: Key Entry Points

| Task | Command |
|------|---------|
| Run backend (dev) | `uvicorn api:app --reload --port 8000` |
| Run frontend (dev) | `cd frontend && npm run dev` |
| Run both (Windows) | `run.bat` |
| Docker up | `docker compose up -d` |
| Run tests | `python -m unittest discover -s tests` |
| CLI mode | `python main.py --file data/file.csv --question "..."` |
| View API docs | `http://localhost:8000/docs` |