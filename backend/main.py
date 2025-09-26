from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI()

# Enable CORS so frontend can talk to backend
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class QueryFilters(BaseModel):
    minAge: Optional[int] = None
    maxAge: Optional[int] = None
    diagnosis: Optional[str] = None

class QueryRequest(BaseModel):
    query: str
    filters: Optional[QueryFilters] = None

# Dummy patient generator
CONDITIONS = ["Diabetes", "Hypertension", "Asthma", "Cardiovascular", "Cancer"]
FIRST_NAMES = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Jane"]

def generate_patients(n=50):
    patients = []
    for _ in range(n):
        patient = {
            "name": random.choice(FIRST_NAMES),
            "age": random.randint(20, 80),
            "condition": random.choice(CONDITIONS),
            "count": random.randint(1, 3)
        }
        patients.append(patient)
    return patients

# Create dataset at startup
DATASET = generate_patients()

# POST /query endpoint
@app.post("/query")
def query_data(req: QueryRequest):
    filtered_patients = DATASET

    # Apply filters
    if req.filters:
        if req.filters.minAge is not None:
            filtered_patients = [p for p in filtered_patients if p["age"] >= req.filters.minAge]
        if req.filters.maxAge is not None:
            filtered_patients = [p for p in filtered_patients if p["age"] <= req.filters.maxAge]
        if req.filters.diagnosis:
            filtered_patients = [p for p in filtered_patients if req.filters.diagnosis.lower() in p["condition"].lower()]

    # Generate chart data
    chart_data = {}
    for p in filtered_patients:
        chart_data[p["condition"]] = chart_data.get(p["condition"], 0) + 1

    chart_data_list = [{"name": k, "value": v} for k, v in chart_data.items()]

    return {
        "message": "Query successful",
        "results": filtered_patients,
        "chartData": chart_data_list
    }

# GET /query_suggestions?q=...
@app.get("/query_suggestions")
def query_suggestions(q: str):
    return [cond for cond in CONDITIONS if q.lower() in cond.lower()]
