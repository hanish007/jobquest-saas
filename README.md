# Career Copilot: AI-Powered Job Application Tracker

![Career Copilot Banner](https://via.placeholder.com/1200x400?text=Career+Copilot+Dashboard+Screenshot)

## The Problem
Job hunting is chaotic. Applications are scattered across emails, resumes need constant tailoring to pass ATS filters, and interview preparation is often generic and unhelpful. Keeping track of everything while trying to stand out is a full-time job in itself.

## The Solution
**Career Copilot** is a full-stack SaaS platform designed to streamline your job search. It combines a drag-and-drop Kanban board for tracking applications with an AI-powered assistant that analyzes your resume against job descriptions and generates custom interview questions to help you land your dream job.

## Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

## Key Features

### 📊 Kanban Board
Visualize your job hunt status with an intuitive drag-and-drop board. Track applications from "Wishlist" to "Applied", "Interview", and "Offer".

### 🧠 AI Resume Matcher
Upload your PDF resume and a job description. Our Gemini-powered AI analyzes the match, provides a score (0-100), highlights missing keywords, and offers actionable advice to improve your chances.

### 🎯 Interview Simulator
Stop practicing with generic questions. Career Copilot generates custom Technical and Behavioral interview questions tailored specifically to the job description you are targeting. Includes an interactive "Safe Mode" to test your answers.

## Architecture

```mermaid
graph TD
    Client[React Frontend] -->|HTTP/JSON| Backend[FastAPI Backend]
    Client -->|Auth/Data| DB[Supabase]
    Backend -->|Generation| AI[Gemini API]
    Backend -->|PDF Parsing| PDF[PyPDF]
```

## Installation

### Frontend (React)
```bash
cd jobquest-saas
npm install
npm run dev
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Security & Reliability
- **Strict JSON Enforcement**: Backend implements robust cleaning and retry logic to ensure AI responses are always valid JSON.
- **Circuit Breakers**: Fallback mechanisms prevent UI crashes even if the AI service experiences issues.

---
&copy; 2024 Career Copilot. Built with ❤️ and AI.
