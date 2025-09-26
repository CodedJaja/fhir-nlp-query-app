import requests

resp = requests.post("http://127.0.0.1:8000/query", json={"query": "diabetes"})
print("Status:", resp.status_code)
try:
    print("Response:", resp.json())
except Exception:
    print("Raw Response:", resp.text)
