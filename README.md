# FHIR NLP Query App

This repo contains:
- **Backend (Python + FastAPI + spaCy)** → NLP query parsing → FHIR-style simulated data.
- **Frontend (Next.js + Tailwind + Chart.js)** → User query input, autocomplete, table + chart display.

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`
