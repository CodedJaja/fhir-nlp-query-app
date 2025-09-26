---

HEAD
# FHIR NLP Query App
A full-stack app that lets users search FHIR patient data using natural language, with a FastAPI backend and React/Next.js frontend.

This repo contains:
- *Backend (Python + FastAPI + spaCy)* → NLP query parsing → FHIR-style simulated data.
- *Frontend (Next.js + Tailwind + Chart.js)* → User query input, autocomplete, table + chart display.
# 🧠 FHIR NLP Query App  
(Prepare for rebase: include backend and root changes)

## Running Locally
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/CodedJaja/fhir-nlp-query-app/ci.yml?branch=main)](https://github.com/CodedJaja/fhir-nlp-query-app/actions)
[![GitHub License](https://img.shields.io/github/license/CodedJaja/fhir-nlp-query-app)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/CodedJaja/fhir-nlp-query-app)](https://github.com/CodedJaja/fhir-nlp-query-app/issues)
[![GitHub stars](https://img.shields.io/github/stars/CodedJaja/fhir-nlp-query-app)](https://github.com/CodedJaja/fhir-nlp-query-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/CodedJaja/fhir-nlp-query-app)](https://github.com/CodedJaja/fhir-nlp-query-app/network/members)

### Backend
bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000

---

## 📖 About  
FHIR NLP Query App is a full-stack application that integrates *Natural Language Processing (NLP)* with *FHIR (Fast Healthcare Interoperability Resources)* to allow users to query, analyze, and visualize medical records in plain English.  

Key Features:  
- 🗣 Natural language queries → structured FHIR data  
- ⚡ FastAPI backend for NLP + FHIR handling  
- 🎨 React + Next.js frontend for rich UI  
- 🐘 PostgreSQL database for persistence  
- 🐳 Dockerized for easy deployment  

---

## 🚀 Tech Stack  
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)  
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)  
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)  
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)  
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)  
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)  
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)  

---

## ⚙ Getting Started  

### Frontend
### 1. Clone the repo  
bash
cd frontend
npm install
npm run dev

git clone https://github.com/CodedJaja/fhir-nlp-query-app.git
cd fhir-nlp-query-app

Visit: http://localhost:3000
