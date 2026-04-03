"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizCard } from "@/components/quiz/QuizCard"
import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/types"
import type { QuizCategory } from "@/types"
import { Calendar, Flame, Loader2, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DailyData {
  challenge: {
    id: string
    date: string
    category: string
    completed: boolean
    score: number | null
    streak: number
  }
  question: {
    id: string
    category: string
    difficulty: string
    type: string
    prompt: string
    context?: string | null
    options?: { id: string; label: string; text: string }[] | null
    correctAnswer?: unknown
    explanation?: string
  }
}

export default function DailyPage() {
  const [data, setData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    isCorrect: boolean
    correctAnswer: unknown
    explanation: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/daily')
      .then(res => res.json())
      .then((d) => {
        setData(d)
        if (d.challenge.completed) {
          setSubmitted(true)
          setResult({
            isCorrect: (d.challenge.score ?? 0) >= 50,
            correctAnswer: d.question.correctAnswer,
            explanation: d.question.explanation || '',
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (answer: string) => {
    if (!data) return
    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: data.challenge.date,
          questionId: data.question.id,
          answer,
        }),
      })
      const r = await res.json()
      setResult({
        isCorrect: r.isCorrect,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return <div className="p-6">Failed to load daily challenge.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8" /> Daily Challenge
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <span className="text-2xl font-bold">{data.challenge.streak}</span>
          <span className="text-sm text-muted-foreground">streak</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{CATEGORY_ICONS[data.challenge.category as QuizCategory]}</span>
            <div>
              <CardTitle className="text-lg">
                {CATEGORY_LABELS[data.challenge.category as QuizCategory]}
              </CardTitle>
              <CardDescription>Today&apos;s category</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <QuizCard
        question={data.question}
        onSubmit={handleSubmit}
        disabled={submitted}
        showResult={submitted}
        result={result ? { ...result, userAnswer: undefined } : null}
      />

      {submitted && (
        <Card className="text-center">
          <CardContent className="py-8">
            {result?.isCorrect ? (
              <>
                <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold text-green-600 mb-2">Correct!</h2>
                <p className="text-muted-foreground mb-4">Great work! Come back tomorrow for another challenge.</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💪</span>
                </div>
                <h2 className="text-xl font-bold text-red-600 mb-2">Not quite!</h2>
                <p className="text-muted-foreground mb-4">Review the explanation above and keep practicing.</p>
              </>
            )}
            <div className="flex justify-center gap-4">
              <Link href={`/quiz/${data.challenge.category}`}>
                <Button variant="outline">
                  Practice More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/study">
                <Button>Study This Topic</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
