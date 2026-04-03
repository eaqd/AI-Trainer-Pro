import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Per-category accuracy
    const progress = await prisma.userProgress.findMany()
    const categoryAccuracy = progress.map(p => ({
      category: p.category,
      accuracy: p.totalAttempted > 0 ? Math.round((p.totalCorrect / p.totalAttempted) * 100) : 0,
      totalAttempted: p.totalAttempted,
      totalCorrect: p.totalCorrect,
      avgTime: Math.round(p.avgTime),
    }))

    // Recent sessions for time series
    const sessions = await prisma.quizSession.findMany({
      where: { completed: true },
      orderBy: { completedAt: 'asc' },
      take: 50,
    })

    const sessionTimeline = sessions.map(s => ({
      date: s.completedAt?.toISOString().split('T')[0] || '',
      category: s.category || 'mixed',
      score: s.score || 0,
      duration: s.duration || 0,
      totalQ: s.totalQ,
      correctQ: s.correctQ,
    }))

    // Accuracy by difficulty
    const answers = await prisma.quizAnswer.findMany({
      include: { question: { select: { difficulty: true, category: true } } },
    })

    const difficultyStats: Record<string, { correct: number; total: number }> = {
      beginner: { correct: 0, total: 0 },
      intermediate: { correct: 0, total: 0 },
      advanced: { correct: 0, total: 0 },
    }

    const categoryMissed: Record<string, number> = {}

    answers.forEach(a => {
      const diff = a.question.difficulty
      if (difficultyStats[diff]) {
        difficultyStats[diff].total++
        if (a.isCorrect) difficultyStats[diff].correct++
      }
      if (!a.isCorrect) {
        const cat = a.question.category
        categoryMissed[cat] = (categoryMissed[cat] || 0) + 1
      }
    })

    const accuracyByDifficulty = Object.entries(difficultyStats).map(([level, stats]) => ({
      difficulty: level,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      total: stats.total,
    }))

    // Most missed categories
    const mostMissed = Object.entries(categoryMissed)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, missed]) => ({ category, missed }))

    return NextResponse.json({
      categoryAccuracy,
      sessionTimeline,
      accuracyByDifficulty,
      mostMissed,
      totalSessions: sessions.length,
      totalAnswers: answers.length,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
