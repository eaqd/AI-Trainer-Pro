"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/types"
import type { QuizCategory, DashboardData } from "@/types"
import {
  Brain,
  GraduationCap,
  Calendar,
  BookOpen,
  Flame,
  Target,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return <div className="p-6">Failed to load dashboard data.</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to AI Trainer Pro</h1>
        <p className="text-muted-foreground">
          Your personal training platform for AI evaluation qualification tests
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="w-4 h-4" /> Readiness Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.readinessScore}%</div>
            <Progress value={data.readinessScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Questions Answered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalAnswered}</div>
            <p className="text-xs text-muted-foreground mt-1">of {data.totalQuestions} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Flame className="w-4 h-4" /> Current Streak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.currentStreak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.currentStreak > 0 ? "Keep it going!" : "Start your streak today!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Sessions Completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.recentSessions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">recent sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
          <CardDescription>Jump into a training mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/quiz">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Brain className="w-6 h-6" />
                <span className="text-xs">Practice Quiz</span>
              </Button>
            </Link>
            <Link href="/exam">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <GraduationCap className="w-6 h-6" />
                <span className="text-xs">Exam Mode</span>
              </Button>
            </Link>
            <Link href="/daily">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-xs">Daily Challenge</span>
              </Button>
            </Link>
            <Link href="/study">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span className="text-xs">Study Mode</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.categoryProgress.length > 0 ? (
              data.categoryProgress.map((cp) => (
                <div key={cp.category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[cp.category as QuizCategory]}</span>
                      <span>{CATEGORY_LABELS[cp.category as QuizCategory] || cp.category}</span>
                    </span>
                    <span className="text-muted-foreground">
                      {cp.accuracy}% ({cp.totalCorrect}/{cp.totalAttempted})
                    </span>
                  </div>
                  <Progress
                    value={cp.accuracy}
                    indicatorClassName={
                      cp.accuracy >= 80 ? "bg-green-500" :
                      cp.accuracy >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No progress yet. Start a quiz to begin tracking!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weak Areas & Recent Activity */}
        <div className="space-y-6">
          {data.weakAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Areas to Improve</CardTitle>
                <CardDescription>Categories where you need more practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.weakAreas.map((area) => (
                  <Link key={area.category} href={`/quiz/${area.category}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <span>{CATEGORY_ICONS[area.category as QuizCategory]}</span>
                        <span className="text-sm font-medium">
                          {CATEGORY_LABELS[area.category as QuizCategory]}
                        </span>
                      </div>
                      <Badge variant={area.accuracy < 60 ? "destructive" : "warning"}>
                        {area.accuracy}%
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {data.recentSessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{CATEGORY_ICONS[s.category as QuizCategory] || '📝'}</span>
                        <span>{CATEGORY_LABELS[s.category as QuizCategory] || 'Mixed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          (s.score ?? 0) >= 80 ? "success" :
                          (s.score ?? 0) >= 60 ? "warning" : "destructive"
                        }>
                          {s.score ?? 0}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {s.correctQ}/{s.totalQ}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity. Start practicing!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
