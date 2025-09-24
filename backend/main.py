from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so frontend can access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy patient data for demonstration
patients = [
    {"id": 1, "name": "John Doe", "age": 45, "condition": "diabetes"},
    {"id": 2, "name": "Jane Smith", "age": 50, "condition": "hypertension"},
    {"id": 3, "name": "Alice Johnson", "age": 30, "condition": "asthma"},
]

@app.get("/query")
async def query_patients(q: str = Query(..., min_length=1)):
    q_lower = q.lower()
    results = [
        patient for patient in patients
        if q_lower in patient["condition"].lower() or q_lower in patient["name"].lower()
    ]
    return {"results": results}
