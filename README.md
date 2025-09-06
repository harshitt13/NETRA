# Project NETRA

<div align="center">

<pre>
███╗   ██╗███████╗████████╗██████╗  █████╗
████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
██╔██╗ ██║█████╗     ██║   ██████╔╝███████║
██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║
██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║
╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

An AI‑powered financial intelligence platform for detecting and investigating suspicious activity across accounts, persons, and companies.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18.2%2B-blue.svg)](https://reactjs.org)
[![Neo4j (optional)](https://img.shields.io/badge/neo4j-optional-green.svg)](https://neo4j.com)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AnuragWaskle/project-NETRA&dir=backend)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AnuragWaskle/project-NETRA&root-directory=frontend&project-name=netra-frontend&repository-name=netra-frontend)

</div>

## Overview

Project NETRA provides a unified workflow for ingesting datasets (CSV/ZIP), calculating hybrid risk scores, inspecting networks, and generating AI‑assisted PDF reports. It ships with synthetic datasets and lets investigators upload their own data from the UI.

Highlights:
- Hybrid risk scoring (rules) with CSV pipeline; AlertScores.csv is the canonical output.
- Upload your own CSVs or a ZIP of CSVs from Settings; schema validation and re‑analysis runs automatically.
- Graph view uses Neo4j when available; otherwise a small network is synthesized from CSVs.
- PDF report generation; endpoint now accepts either a person_id or a case_id.
- Optional AI summary via Google Gemini with deterministic local fallback.
- Authentication is token‑based; mock tokens are supported for local/demo.

## Architecture

Backend (Flask):
- Data loader with schema validation (CSV under `backend/generated-data/`).
- Risk scoring (`services/risk_scoring.py`), AI summarizer, report generator, optional graph analyzer.
- Case management with Firebase Firestore if configured, else local JSON fallback.

Frontend (React + Vite):
- Centralized API client with envelope unwrapping and token provider.
- Pages: Dashboard, Triage, Investigation Workspace, Reporting, Settings.
- Settings provides dataset upload (CSV/ZIP) and metadata view.

Data generation:
- `data-generation/generate_data.py` produces CSVs into `backend/generated-data/`.
- Optional Neo4j loading via scripts in `backend/data-generation/`.

## Quick Start (Local)

Prereqs: Python 3.10+, Node 18+.

Backend:
1) `cd backend`
2) `python -m venv venv` (Windows: `venv\Scripts\activate`, macOS/Linux: `source venv/bin/activate`)
3) `pip install -r requirements.txt`
4) Set env (optional but recommended):
   - `GEMINI_API_KEY` for AI summaries (else a rule‑based fallback is used)
   - `FRONTEND_URL` for CORS (e.g. http://localhost:5173)
   - `FIREBASE_CREDENTIALS` or `GOOGLE_APPLICATION_CREDENTIALS` if using Firestore
5) Run: `python app.py` (serves on http://localhost:5001)

Frontend:
1) `cd frontend`
2) `npm install`
3) Optional: set `VITE_API_URL` to your backend API base (e.g. http://localhost:5001/api). If unset, it auto‑detects localhost and uses `http://localhost:5001/api`.
4) `npm run dev` (http://localhost:5173)

Authentication (local/mock):
- The backend accepts `Authorization: Bearer mock-jwt-token-12345`.
- The frontend includes a mock token provider in development to call protected APIs.

## Dataset Uploads (CSV/ZIP)

Upload via UI: Settings → Data Management.

- ZIP upload: include any of these exact filenames (case‑insensitive):
  - Persons.csv, BankAccounts.csv, Transactions.csv, Companies.csv, Directorships.csv, Properties.csv, PoliceCases.csv
- Single CSV upload: choose which dataset it represents (dropdown in the UI).
- After upload, the server reloads all CSVs and re‑runs analysis to regenerate alerts.

Schemas (minimal required columns):
- persons: person_id, full_name, dob, pan_number, address, monthly_salary_inr, tax_filing_status
- accounts: account_number, owner_id, bank_name, account_type, open_date, balance_inr
- transactions: transaction_id, from_account, to_account, amount_inr, timestamp, payment_mode, remarks
- companies: cin, company_name, registered_address, incorporation_date, company_status, paid_up_capital_inr
- directorships: directorship_id, person_id, cin, appointment_date
- properties: property_id, owner_person_id, property_address, purchase_date, purchase_value_inr
- cases: case_id, person_id, case_details, case_date, status

Sample data that triggers alerts:
- See `samples/` at the repo root (ready‑named CSVs) or `frontend/public/samples/` for individual examples and a README.

## Key Endpoints (Backend)

Base path is `/api`.

- GET `/alerts` → list of alerts (reads `AlertScores.csv`).
- GET `/persons?q=<query>` → search persons.
- GET `/investigate/<person_id>` → risk breakdown for a person.
- GET `/graph/<person_id>` → network; synthesizes from CSVs if Neo4j empty/unavailable.
- GET `/report/<person_or_case_id>` → PDF report; accepts person_id or case_id.
- POST `/cases` → create case; body must include `person_id` or embed it in `risk_profile.person_details`.
- GET `/cases` → list cases (Firestore or local fallback).
- POST `/datasets/upload` → upload CSV/ZIP; validates, reloads, reruns analysis.
- GET `/datasets/metadata` → seed/snapshot/counts (if metadata.json present; counts are derived regardless).
- POST `/run-analysis` (or `?sync=1`) and GET `/run-analysis/status` → control risk analysis.
- Settings: `/settings/profile`, `/settings/api-key`, `/settings/theme`, `/settings/regenerate-data`, `/settings/clear-cases`.

Auth:
- All protected routes use `Authorization: Bearer <token>`.
- Mock token accepted: `mock-jwt-token-12345`.

## Reporting

- The Reporting page downloads PDF via `/api/report/<id>`. You can pass a caseId or personId.
- The PDF score is harmonized with `AlertScores.csv` to match the dashboard.

## Data Generation

- `data-generation/generate_data.py` writes CSVs to `backend/generated-data/`.
- From the backend Settings page you can trigger regeneration.
- If using Neo4j, see `backend/data-generation/load_to_neo4j.py` for loading.

## Project Structure

```
project-NETRA/
├── backend/
│   ├── app.py                 # Flask API (CORS, endpoints, uploads, reports)
│   ├── services/              # risk_scoring, report_generator, graph_analysis, case_manager, ai_summarizer
│   ├── utils/                 # data_loader (schemas), auth (mock/real)
│   └── generated-data/        # CSVs + AlertScores.csv (+ metadata.json if present)
├── frontend/
│   ├── src/pages/             # Dashboard, Triage, Investigation, Reporting, Settings
│   ├── src/services/api.js    # API base resolver + token provider + endpoints
│   └── public/samples/        # Downloadable sample CSVs
├── data-generation/           # generate_data.py, patterns.py (synthetic data)
├── samples/                   # Ready‑named CSVs to ZIP & upload (alerts guaranteed)
└── README.md
```

## Configuration

Backend env:
- `FRONTEND_URL` (for CORS), e.g. http://localhost:5173
- `GEMINI_API_KEY` (optional): for AI summaries
- `FIREBASE_CREDENTIALS` (JSON or base64 JSON) or `GOOGLE_APPLICATION_CREDENTIALS` (path) for Firestore
- `RISK_ALERT_THRESHOLD` (optional, default 10)

Frontend env:
- `VITE_API_URL` (optional): override API base; otherwise auto‑detects localhost `http://localhost:5001/api` or same‑origin `/api` in production
- `VITE_USE_MOCK_AUTH` (optional): use mock auth in local dev

## Notes

- Notifications feature was removed.
- Graph view gracefully falls back to synthesized edges if Neo4j is not available.
- If reports fail with “Person ID not found”, ensure the case points to a person present in current CSVs; the report endpoint now also resolves from `caseId`.

## Contributing

1) Fork the repo
2) Create a feature branch (`git checkout -b feature/your-change`)
3) Commit & push
4) Open a PR

## License

MIT © Project NETRA contributors
