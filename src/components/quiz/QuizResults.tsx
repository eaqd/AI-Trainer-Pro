"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getGrade, getPassFailStatus } from "@/lib/scoring"
import { CATEGORY_LABELS } from "@/types"
import type { QuizCategory } from "@/types"
import { CheckCircle, XCircle, Trophy, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

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

interface QuizResultsProps {
  session: {
    id: string
    category: string | null
    mode: string
    score: number | null
    totalQ: number
    correctQ: number
  }
  results: ResultItem[]
}

export function QuizResults({ session, results }: QuizResultsProps) {
  const score = session.score ?? 0
  const grade = getGrade(score)
  const passed = getPassFailStatus(score)

  useEffect(() => {
    if (score >= 90) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      })
    }
  }, [score])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Score Summary */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {score >= 80 ? (
              <Trophy className="w-16 h-16 text-yellow-500" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold">{grade}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-3xl">{score}%</CardTitle>
          <p className="text-muted-foreground">
            {session.correctQ} of {session.totalQ} correct
          </p>
          <div className="mt-2">
            {session.mode === 'exam' && (
              <Badge variant={passed ? "success" : "destructive"} className="text-sm">
                {passed ? 'PASSED' : 'FAILED'} (80% required)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={score} className="h-3" />
          <div className="flex justify-center gap-4 mt-6">
            <Link href={session.category ? `/quiz?category=${session.category}` : '/quiz'}>
              <Button variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detailed Review</h2>
        {results.map((r, index) => (
          <Card key={r.questionId} className={r.isCorrect ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {r.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium">Question {index + 1}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {CATEGORY_LABELS[r.category as QuizCategory] || r.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{r.difficulty}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{r.prompt}</p>
              {r.context && (
                <pre className="text-xs bg-muted p-3 rounded mb-3 whitespace-pre-wrap font-mono overflow-x-auto">
                  {r.context}
                </pre>
              )}
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Your answer:</span>{' '}
                  <span className={r.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {JSON.stringify(r.userAnswer)}
                  </span>
                </p>
                {!r.isCorrect && (
                  <p>
                    <span className="font-medium">Correct answer:</span>{' '}
                    <span className="text-green-600">{JSON.stringify(r.correctAnswer)}</span>
                  </p>
                )}
              </div>
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">Explanation:</p>
                <p className="text-blue-900 dark:text-blue-300">{r.explanation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
