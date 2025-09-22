from fastapi import FastAPI
from pydantic import BaseModel
import spacy

app = FastAPI()
nlp = spacy.load("en_core_web_sm")

class QueryRequest(BaseModel):
    query: str

@app.post("/query")
def query_fhir(req: QueryRequest):
    text = req.query.lower()
    condition, age, gender = None, None, None

    if "diabetic" in text:
        condition = "Diabetes"
    elif "hypertension" in text:
        condition = "Hypertension"
    elif "asthma" in text:
        condition = "Asthma"
    elif "epilepsy" in text:
        condition = "Epilepsy"

    if "over 50" in text:
        age = "ge50"
    elif "under 40" in text:
        age = "le40"
    elif "over 65" in text:
        age = "ge65"
    elif "children" in text:
        age = "le12"

    if "male" in text:
        gender = "male"
    elif "female" in text:
        gender = "female"

    patients = [
        {"name": "John Doe", "age": 55, "gender": "male", "condition": "Diabetes"},
        {"name": "Jane Smith", "age": 62, "gender": "female", "condition": "Diabetes"},
        {"name": "Mark Lee", "age": 48, "gender": "male", "condition": "Hypertension"},
        {"name": "Mary Johnson", "age": 70, "gender": "female", "condition": "Diabetes"},
    ]

    filtered = []
    for p in patients:
        if condition and p["condition"].lower() != condition.lower():
            continue
        if gender and p["gender"].lower() != gender.lower():
            continue
        if age:
            if age.startswith("ge") and p["age"] < int(age[2:]):
                continue
            if age.startswith("le") and p["age"] > int(age[2:]):
                continue
        filtered.append(p)

    return {"patients": filtered}
