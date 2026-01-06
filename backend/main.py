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
        
        cleaned_text = response.text.strip()
        # Remove markdown code blocks if present
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        elif cleaned_text.startswith("```"):
             cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        
        try:
            json_data = json.loads(cleaned_text)
            return json_data
        except json.JSONDecodeError:
             return {"raw_response": response.text}
            
    except Exception as e:
        return {"error": str(e)}

# Force rebuild
