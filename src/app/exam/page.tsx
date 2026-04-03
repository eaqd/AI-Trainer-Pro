"use client"

import { useState, useEffect, useCallback, useRef } from "react"

import { QuizCard } from "@/components/quiz/QuizCard"
import { QuizProgress } from "@/components/quiz/QuizProgress"
import { QuizResults } from "@/components/quiz/QuizResults"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/utils"
import { Clock, Loader2, GraduationCap, AlertTriangle } from "lucide-react"

interface QuestionData {
  id: string; category: string; difficulty: string; type: string
  prompt: string; context?: string | null
  options?: { id: string; label: string; text: string }[] | null
}
interface SessionData {
  id: string; category: string | null; mode: string; score: number | null
  totalQ: number; correctQ: number
}
interface ResultItem {
  questionId: string; prompt: string; context?: string | null; type: string
  userAnswer: unknown; correctAnswer: unknown; isCorrect: boolean
  explanation: string; difficulty: string; category: string
}

const PRESETS = [
  { name: "Easy Warmup", time: 30 * 60, count: 15, description: "30 minutes, 15 questions" },
  { name: "Standard Qualification", time: 45 * 60, count: 25, description: "45 minutes, 25 questions" },
  { name: "Hard Challenge", time: 60 * 60, count: 40, description: "60 minutes, 40 questions" },
]

export default function ExamPage() {
  const [mode, setMode] = useState<'setup' | 'exam' | 'results'>('setup')
  const [preset, setPreset] = useState(1)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map())
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [finalResults, setFinalResults] = useState<{ session: SessionData; results: ResultItem[] } | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  const finishExam = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!session) return
    try {
      const res = await fetch(`/api/quiz/results?sessionId=${session.id}`)
      const data = await res.json()
      setFinalResults(data)
      setMode('results')
    } catch (error) {
      console.error('Failed to fetch results:', error)
    }
  }, [session])

  useEffect(() => {
    if (mode === 'exam' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [mode, timeLeft, finishExam])

  const startExam = async () => {
    const config = PRESETS[preset]
    setLoading(true)
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'exam', questionCount: config.count }),
      })
      const data = await res.json()
      setSession(data.session)
      setQuestions(data.questions)
      setTimeLeft(config.time)
      setCurrentIndex(0)
      setAnswers(new Map())
      setCorrectCount(0)
      setQuestionStartTime(Date.now())
      setMode('exam')
    } catch (error) {
      console.error('Failed to start exam:', error)
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
        body: JSON.stringify({ sessionId: session.id, questionId: question.id, answer: JSON.parse(answer), timeSpent }),
      })
      const result = await res.json()
      const newAnswers = new Map(answers)
      newAnswers.set(question.id, JSON.parse(answer))
      setAnswers(newAnswers)
      if (result.isCorrect) setCorrectCount(prev => prev + 1)

      // Auto-advance in exam mode (no feedback shown)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setQuestionStartTime(Date.now())
      } else {
        finishExam()
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  if (mode === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <GraduationCap className="w-8 h-8" /> Exam Mode
          </h1>
          <p className="text-muted-foreground">
            Simulate a real qualification test. No feedback until the end.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            The timer starts immediately. You won&apos;t see feedback until the exam is complete. 80% is needed to pass.
          </p>
        </div>

        <div className="space-y-4">
          {PRESETS.map((p, i) => (
            <Card
              key={i}
              className={`cursor-pointer transition-all ${preset === i ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
              onClick={() => setPreset(i)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{p.time / 60} min</Badge>
                  <Badge variant="outline">{p.count} questions</Badge>
                  <Badge variant="outline">80% to pass</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button onClick={startExam} disabled={loading} className="w-full" size="lg">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Start Exam
        </Button>
      </div>
    )
  }

  if (mode === 'results' && finalResults) {
    return (
      <div className="p-6">
        <QuizResults session={finalResults.session} results={finalResults.results} />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  if (!currentQuestion) return null

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Timer and Progress */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Exam Mode</h1>
        <div className={`flex items-center gap-2 text-lg font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : ''}`}>
          <Clock className="w-5 h-5" />
          {formatDuration(timeLeft)}
        </div>
      </div>

      <QuizProgress current={currentIndex + 1} total={questions.length} correctCount={correctCount} />

      {/* No showResult in exam mode */}
      <QuizCard question={currentQuestion} onSubmit={handleSubmit} />

      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Answers submitted: {answers.size}/{questions.length}
        </span>
        <Button variant="destructive" onClick={finishExam}>
          End Exam Early
        </Button>
      </div>
    </div>
  )
}
