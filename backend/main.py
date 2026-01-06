from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import pypdf
import io
import json

from dotenv import load_dotenv
load_dotenv()
# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')
app = FastAPI()
# --- THE CRITICAL FIX --- 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (React, Vercel, etc.)
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, etc.
    allow_headers=["*"],
)
# ------------------------
class AiRequest(BaseModel):
    type: str
    job_description: str
    user_resume: str

class InterviewRequest(BaseModel):
    job_description: str

@app.get("/")
async def health_check():
    return {"status": "active", "service": "JobQuest AI API"}

@app.post("/api/generate")
async def generate_content(request: AiRequest):
    print(f"Received request: {request.type}") # Log to terminal
    prompt = ""
    if request.type == "cover" or request.type == "cover-letter":
        prompt = f"Write a professional cover letter for this Job Description: {request.job_description}. Using this Resume: {request.user_resume}"
    elif request.type == "resume":
        prompt = f"Analyze this resume against the JD: {request.job_description}. Resume: {request.user_resume}. List 5 missing keywords."
    elif request.type == "interview":
        prompt = f"Generate 3 interview questions for this JD: {request.job_description}."
    else:
        return {"result": "Invalid request type"}
    try:
        response = model.generate_content(prompt)
        return {"result": response.text}
    except Exception as e:
        return {"result": f"Error: {str(e)}"}

import re

# ... existing imports ...

def clean_json_text(text: str) -> str:
    cleaned_text = text.strip()
    # Remove markdown code blocks if present using regex for robustness
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", cleaned_text, re.DOTALL)
    if match:
        cleaned_text = match.group(1)
    else:
        # Fallback for simple markdown stripping if regex misses (though regex covers most)
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        elif cleaned_text.startswith("```"):
             cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
    return cleaned_text.strip()

@app.post("/api/analyze-resume")
async def analyze_resume(resume: UploadFile = File(...), job_description: str = Form(...)):
    if not resume.filename.lower().endswith(".pdf"):
         return {"error": "Invalid file format. Please upload a PDF."}
    
    try:
        content = await resume.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
            
        prompt = f"Act as a Hiring Manager. Compare this RESUME content: {text} against this JOB DESCRIPTION: {job_description}. Return a JSON response with: 'match_score' (integer 0-100), 'missing_keywords' (list of strings), and 'advice' (short string)."
        
        response = model.generate_content(prompt)
        cleaned_text = clean_json_text(response.text)
        
        try:
            json_data = json.loads(cleaned_text)
            return json_data
        except json.JSONDecodeError:
             return {"raw_response": response.text}
            
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/interview-prep")
async def generate_interview_questions(request: InterviewRequest):
    try:
        # Strict Prompt
        prompt = f"You are a JSON generator. Output ONLY raw JSON. No markdown formatting. No ```json blocks. Act as a Technical Interviewer. Generate 5 interview questions for this JOB DESCRIPTION: {request.job_description}. Return a JSON object with a key 'questions' containing a list of objects, where each object has 'question' (string), 'type' (Technical/Behavioral), and 'suggested_answer' (short string)."
        
        response = model.generate_content(prompt)
        cleaned_text = clean_json_text(response.text)

        try:
            json_data = json.loads(cleaned_text)
            return json_data
        except json.JSONDecodeError:
             print("JSON Decode Error, returning fallback.")
             pass

    except Exception as e:
        print(f"Gemini Error: {e}")
        pass

    # Fallback Mechanism
    return {
        "questions": [
            {
                "question": "Tell me about a challenging project you worked on.",
                "type": "Behavioral",
                "suggested_answer": "Discuss a project with specific challenges, your actions, and the results (STAR method)."
            },
            {
                "question": "What are your strengths and weaknesses?",
                "type": "Behavioral",
                "suggested_answer": "Highlight relevant strengths and a genuine weakness you are working to improve."
            },
            {
                "question": "Describe a time you had a conflict with a colleague.",
                "type": "Behavioral",
                "suggested_answer": "Focus on professional resolution and what you learned."
            },
             {
                "question": "Explain a complex technical concept to a non-technical audience.",
                "type": "Technical",
                "suggested_answer": "Use analogies and simple language to explain the core concept."
            },
             {
                "question": "Why do you want to work for this company?",
                "type": "Behavioral",
                "suggested_answer": "Connect your skills and values with the company's mission and products."
            }
        ]
    }

# Force rebuild
