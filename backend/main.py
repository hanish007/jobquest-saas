from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
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
