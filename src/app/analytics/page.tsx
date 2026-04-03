"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_LABELS } from "@/types"
import type { QuizCategory } from "@/types"
import { Loader2, BarChart3, TrendingUp, Target, AlertTriangle } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from "recharts"

interface AnalyticsData {
  categoryAccuracy: { category: string; accuracy: number; totalAttempted: number; totalCorrect: number; avgTime: number }[]
  sessionTimeline: { date: string; category: string; score: number }[]
  accuracyByDifficulty: { difficulty: string; accuracy: number; total: number }[]
  mostMissed: { category: string; missed: number }[]
  totalSessions: number
  totalAnswers: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
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

  if (!data) return <div className="p-6">Failed to load analytics.</div>

  const hasData = data.totalAnswers > 0

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No data yet</h2>
            <p className="text-muted-foreground">Complete some quizzes to see your analytics here.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Total Sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSessions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Target className="w-4 h-4" /> Total Answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalAnswers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Avg Accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.categoryAccuracy.length > 0
                    ? Math.round(data.categoryAccuracy.reduce((s, c) => s + c.accuracy, 0) / data.categoryAccuracy.filter(c => c.totalAttempted > 0).length || 0)
                    : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Accuracy Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accuracy by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.categoryAccuracy.filter(c => c.totalAttempted > 0)} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tickFormatter={(v) => (CATEGORY_LABELS[v as QuizCategory] || v).split(' ').slice(0, 2).join(' ')}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Accuracy']}
                    labelFormatter={(label) => CATEGORY_LABELS[label as QuizCategory] || label}
                  />
                  <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {data.categoryAccuracy.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Timeline */}
            {data.sessionTimeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Score Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.sessionTimeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={11} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Accuracy by Difficulty */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accuracy by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.accuracyByDifficulty.filter(d => d.total > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="difficulty" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Most Missed */}
          {data.mostMissed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Most Missed Categories
                </CardTitle>
                <CardDescription>Categories with the most incorrect answers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.mostMissed.map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm font-medium">
                        {CATEGORY_LABELS[item.category as QuizCategory] || item.category}
                      </span>
                      <Badge variant="destructive">{item.missed} missed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
