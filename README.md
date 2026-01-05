# JobQuest SaaS
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://[YOUR-FRONTEND-URL].onrender.com)

**An intelligent job application tracker that uses GenAI to analyze job descriptions and optimize your career journey.**

JobQuest combines a modern Kanban workflow with advanced AI assistance to generate cover letters, fix resumes, and prep for interviews in seconds. It leverages a microservices-inspired architecture to securely handle AI processing while maintaining a responsive user experience.

## System Architecture

```
[ React Client ]  <─── (Supabase SDK) ───>  [ Supabase (Auth + DB) ]
       ↕
    (HTTPS)
       ↕
[ Python API ]  ─── (Secure Key) ───>  [ Google Gemini AI ]
```

## Key Features

*   **AI Copilot Integration**: Uses **Google Gemini 1.5** via a secure Python proxy to analyze Job Descriptions and generate tailored content (Cover Letters, Interview Prep).
*   **Secure Authentication**: Implements **Row Level Security (RLS)** in PostgreSQL via Supabase to ensure users can only access their own data.
*   **Modern Kanban Interface**: A highly responsive drag-and-drop board built with **React** and **@dnd-kit**, featuring optimistic UI updates.
*   **Prompt Engineering**: Backend-managed system prompts designed to extract specific keywords from resumes and match them against job requirements.
*   **Scalable Architecture**: Decoupled frontend and backend allowing independent scaling and development of the AI service.

## Setup Guide

### 1. Frontend (React)
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
*App will run at http://localhost:5173*

### 2. Backend (FastAPI)
```bash
cd backend

# Create virtual environment
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
python -m uvicorn main:app --reload
```
*API will run at http://localhost:8000*

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
*   **Backend**: Python, FastAPI, Uvicorn
*   **AI**: Google Generative AI (Gemini)
*   **Database**: Supabase (PostgreSQL)
