from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

# Enable CORS
origins = [
    "http://localhost:3000",  # frontend dev URL
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example patient database
patients = [
    {"id": 1, "name": "John Doe", "age": 45, "condition": "diabetes"},
    {"id": 2, "name": "Jane Smith", "age": 32, "condition": "hypertension"},
    {"id": 3, "name": "Alice Johnson", "age": 28, "condition": "asthma"},
    {"id": 4, "name": "Bob Brown", "age": 50, "condition": "diabetes"},
]

@app.get("/")
def read_root():
    return {"message": "FHIR NLP API running"}

@app.get("/query")
def query_patients(q: str = Query(..., min_length=1)):
    results = [p for p in patients if q.lower() in p["condition"].lower()]
    if not results:
        raise HTTPException(status_code=404, detail="No patients found")
    return {"results": results}

@app.get("/query_suggestions")
def query_suggestions(q: str = Query(..., min_length=1)):
    """
    Returns auto-complete suggestions for patient conditions matching the query.
    """
    # Collect unique condition suggestions that contain the query substring
    suggestions = list({p["condition"] for p in patients if q.lower() in p["condition"].lower()})
    return {"suggestions": suggestions}
