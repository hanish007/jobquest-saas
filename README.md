# 🚀 JobQuest SaaS
> **Your Intelligent Career Copilot.**
> Tracker for job applications powered by Generative AI to craft perfect cover letters and resume fixes.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge&logo=render)](https://jobquest-backend-ip8m.onrender.com)

---

## 🏗️ Architecture

```mermaid
graph TD
    User((User)) -->|Browser| Client[React + Vite Frontend]
    Client -->|HTTPS/JSON| API[FastAPI Backend]
    
    subgraph "Cloud Services"
        API -->|SQL| DB[(Supabase PostgreSQL)]
        API -->|REST| AI[Google Gemini API]
    end
    
    style Client fill:#61dafb,stroke:#333
    style API fill:#009688,stroke:#333
    style DB fill:#3ecf8e,stroke:#333
    style AI fill:#4285f4,stroke:#333,color:#fff
```

## ✨ Key Features

- **🤖 AI Integration**: Leverages Google Gemini Pro to generate tailored cover letters and resume suggestions in seconds.
- **⚡ Real-time Database**: Built on Supabase for instant data synchronization and rigorous RLS security.
- **☁️ Cloud Deployment**: Fully orchestrated production environment hosted on Render (Frontend + Backend).

---

## 🛠️ Installation

### Prerequisites
- Node.js & npm
- Python 3.9+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jobquest-saas.git
cd jobquest-saas
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd jobquest-saas
npm install
npm run dev
```
