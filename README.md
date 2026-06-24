# 🩺 DeadlineDoctor

> AI that diagnoses WHY you procrastinate and autonomously acts to prevent missed deadlines.

Built for **Vibe2Ship Hackathon** (CodingNinjas × Google for Developers) · Problem Statement: *The Last-Minute Life Saver*

## 🚀 Features

| Feature | What it does |
|---|---|
| **Procrastination Diagnosis** | Gemini AI identifies your type (Perfectionist/Overwhelmed/Distracted/Avoidant) |
| **Ghost Mode** | AI auto-drafts your assignment/email/report at deadline crunch |
| **Deadline Negotiator** | AI writes professional extension request email in one click |
| **Micro-Plan Generator** | Breaks task into 5–25 min sprints at your peak productivity hour |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + Tailwind CSS
- **AI**: Google Gemini 2.0 Flash (via Google AI Studio)
- **Storage**: Browser localStorage (no backend DB needed)
- **Deploy**: Vercel

## ⚡ Setup (5 minutes)

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USERNAME/deadline-doctor
cd deadline-doctor
npm install

# 2. Set environment variable
cp .env.example .env.local
# → Add your GEMINI_API_KEY from https://aistudio.google.com/app/apikey

# 3. Run locally
npm run dev
# → Open http://localhost:3000
```

## 🚀 Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel

# Add env variable in Vercel dashboard:
# GEMINI_API_KEY = your_key_here
```

## 📋 Hackathon Submission Checklist

- [x] Built with Google AI Studio (Gemini API)
- [x] Deployed application link
- [x] GitHub repository with source code
- [ ] Google Doc with project description
- [ ] Submit via BlockseBlock platform

## 🧠 How Agentic Depth Works

```
User adds task
     ↓
Gemini diagnoses procrastination type
     ↓
Micro-Plan generated (personalized to type)
     ↓
At deadline crunch → Ghost Mode auto-drafts output
     ↓
If deadline can't be met → Negotiator writes extension email
     ↓
User approves with 1 click ✅
```

## 📁 Project Structure

```
deadline-doctor/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Main app
│   └── api/
│       ├── diagnose/         # Procrastination diagnosis
│       ├── ghost-mode/       # AI draft generator
│       ├── negotiate/        # Extension email writer
│       └── schedule/         # Micro-task planner
├── components/
│   ├── Header.tsx
│   ├── DiagnosisPanel.tsx
│   ├── TaskCard.tsx
│   ├── GhostModePanel.tsx
│   ├── NegotiatorPanel.tsx
│   └── SchedulePanel.tsx
└── lib/
    ├── gemini.ts             # Gemini AI client
    ├── types.ts              # TypeScript types
    ├── utils.ts              # Helpers
    └── useTasks.ts           # Task state hook
```
