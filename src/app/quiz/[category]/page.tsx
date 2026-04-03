"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { QuizCard } from "@/components/quiz/QuizCard"
import { QuizProgress } from "@/components/quiz/QuizProgress"
import { QuizResults } from "@/components/quiz/QuizResults"
import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS } from "@/types"
import type { QuizCategory } from "@/types"
import { ArrowRight, Loader2 } from "lucide-react"

interface QuestionData {
  id: string
  category: string
  difficulty: string
  type: string
  prompt: string
  context?: string | null
  options?: { id: string; label: string; text: string }[] | null
}

interface SubmitResult {
  isCorrect: boolean
  correctAnswer: unknown
  explanation: string
}

interface SessionData {
  id: string
  category: string | null
  mode: string
  score: number | null
  totalQ: number
  correctQ: number
}

interface ResultItem {
  questionId: string
  prompt: string
  context?: string | null
  type: string
  userAnswer: unknown
  correctAnswer: unknown
  isCorrect: boolean
  explanation: string
  difficulty: string
  category: string
}

export default function QuizCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<SessionData | null>(null)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<Map<string, SubmitResult & { userAnswer: unknown }>>(new Map())
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [finalResults, setFinalResults] = useState<{ session: SessionData; results: ResultItem[] } | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startQuiz()
  }, [category])

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, mode: 'practice', questionCount: 10 }),
      })
      const data = await res.json()
      setSession(data.session)
      setQuestions(data.questions)
      setCurrentIndex(0)
      setResults(new Map())
      setCorrectCount(0)
      setShowResult(false)
      setQuizComplete(false)
      setFinalResults(null)
      setQuestionStartTime(Date.now())
    } catch (error) {
      console.error('Failed to start quiz:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (answer: string) => {
    if (!session || !questions[currentIndex]) return

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    const question = questions[currentIndex]

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          questionId: question.id,
          answer: JSON.parse(answer),
          timeSpent,
        }),
      })
      const result = await res.json()

      const updatedResults = new Map(results)
      updatedResults.set(question.id, {
        ...result,
        userAnswer: JSON.parse(answer),
      })
      setResults(updatedResults)
      setShowResult(true)

      if (result.isCorrect) {
        setCorrectCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowResult(false)
      setQuestionStartTime(Date.now())
    } else {
      // Quiz complete - fetch results
      fetchResults()
    }
  }, [currentIndex, questions.length])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        if (showResult) handleNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showResult, handleNext])

  const fetchResults = async () => {
    if (!session) return
    try {
      const res = await fetch(`/api/quiz/results?sessionId=${session.id}`)
      const data = await res.json()
      setFinalResults(data)
      setQuizComplete(true)
    } catch (error) {
      console.error('Failed to fetch results:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (quizComplete && finalResults) {
    return (
      <div className="p-6">
        <QuizResults session={finalResults.session} results={finalResults.results} />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  if (!currentQuestion) {
    return (
      <div className="p-6 text-center">
        <p>No questions available for this category.</p>
        <Button onClick={() => router.push('/quiz')} className="mt-4">
          Back to Categories
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {CATEGORY_LABELS[category as QuizCategory] || category}
        </h1>
        <Button variant="ghost" onClick={() => router.push('/quiz')}>
          Exit Quiz
        </Button>
      </div>

      <QuizProgress
        current={currentIndex + 1}
        total={questions.length}
        correctCount={correctCount}
      />

      <QuizCard
        question={currentQuestion}
        onSubmit={handleSubmit}
        disabled={showResult}
        showResult={showResult}
        result={results.get(currentQuestion.id) || null}
      />

      {showResult && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="gap-2">
            {currentIndex < questions.length - 1 ? (
              <>Next Question <ArrowRight className="w-4 h-4" /> <span className="text-xs">(N)</span></>
            ) : (
              <>See Results <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
