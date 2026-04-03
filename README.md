# AI Trainer Pro

A self-training platform that prepares you to pass qualification tests and perform well on AI training/evaluation platforms like DataAnnotation.tech, Outlier.ai, Remotasks, Scale AI, and Alignerr.

## Features

- **Dashboard** - Overall readiness score, progress tracking, streak counter, and quick-start buttons
- **Quiz Engine** - 9 quiz categories with 150+ realistic questions covering all major AI training task types
- **Exam Mode** - Timed simulated qualification tests with pass/fail scoring (80% threshold)
- **Study Mode** - Concept cards, rubric guides, platform-specific tips, and AI training glossary
- **Analytics** - Charts showing accuracy by category, difficulty, and over time
- **Daily Challenges** - One new challenge per day with streak tracking
- **Settings** - Dark/light mode, difficulty preferences, daily goals, Claude API key for AI-powered feedback

### Quiz Categories

1. **Prompt & Response Rating** - Rate AI responses on helpfulness, accuracy, safety
2. **Response Comparison** - Compare and rank multiple AI responses
3. **Prompt Writing** - Evaluate and improve prompt quality
4. **Code Review** - Find bugs in Python, JavaScript, SQL, and more
5. **Hallucination Detection** - Spot false claims in AI outputs
6. **Safety Assessment** - Classify content for safety concerns
7. **Instruction Following** - Check if AI followed all instructions
8. **Math & Reasoning** - Verify mathematical solutions
9. **Text Quality** - Evaluate writing quality and style

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + custom UI components
- **Prisma** + SQLite for local persistence
- **Recharts** for analytics visualizations
- **Claude API** (optional) for AI-powered prompt evaluation

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database and seed with 150+ questions
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start training.

### Optional: Claude API

To enable AI-powered prompt evaluation feedback:
1. Get an API key from the Anthropic console
2. Go to Settings in the app
3. Enter your API key

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── quiz/                 # Quiz category selector & quiz interface
│   ├── exam/                 # Timed exam mode
│   ├── study/                # Study materials & glossary
│   ├── analytics/            # Progress charts
│   ├── daily/                # Daily challenge
│   ├── settings/             # User preferences
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Base UI components
│   ├── quiz/                 # Quiz question type components
│   ├── charts/               # Analytics chart components
│   ├── layout/               # Navigation, sidebar
│   └── dashboard/            # Dashboard widgets
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── scoring.ts            # Answer scoring logic
│   ├── claude.ts             # Claude API helper
│   ├── study-content.ts      # Study material data
│   └── utils.ts              # Utility functions
└── types/                    # TypeScript type definitions
```

## Keyboard Shortcuts

- **1-5** - Select answer option / set rating
- **T/F** - Select True/False
- **Enter** - Submit answer
- **N** - Next question (after answer review)
