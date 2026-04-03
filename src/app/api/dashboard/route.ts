import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get category progress
    const progress = await prisma.userProgress.findMany()

    // Calculate overall readiness score
    const totalAttempted = progress.reduce((sum, p) => sum + p.totalAttempted, 0)
    const totalCorrect = progress.reduce((sum, p) => sum + p.totalCorrect, 0)
    const readinessScore = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

    // Get total questions in DB
    const totalQuestions = await prisma.question.count()

    // Get recent sessions
    const recentSessions = await prisma.quizSession.findMany({
      where: { completed: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
    })

    // Calculate streak (consecutive days with completed sessions)
    const sessions = await prisma.quizSession.findMany({
      where: { completed: true },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true },
    })

    let streak = 0
    if (sessions.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let checkDate = new Date(today)

      // Check if there's a session today or yesterday
      const lastSession = sessions[0].completedAt
      if (lastSession) {
        const lastDate = new Date(lastSession)
        lastDate.setHours(0, 0, 0, 0)
        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays > 1) {
          streak = 0
        } else {
          checkDate = new Date(lastDate)
          streak = 1
          // Count backwards
          for (let i = 1; i < sessions.length; i++) {
            const sessionDate = sessions[i].completedAt
            if (!sessionDate) continue
            const sDate = new Date(sessionDate)
            sDate.setHours(0, 0, 0, 0)
            const prev = new Date(checkDate)
            prev.setDate(prev.getDate() - 1)
            if (sDate.getTime() === prev.getTime()) {
              streak++
              checkDate = sDate
            } else if (sDate.getTime() < prev.getTime()) {
              break
            }
          }
        }
      }
    }

    // Find weak areas (categories with lowest accuracy, minimum 3 attempts)
    const weakAreas = progress
      .filter(p => p.totalAttempted >= 3)
      .map(p => ({
        category: p.category,
        accuracy: Math.round((p.totalCorrect / p.totalAttempted) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)

    // Category progress with accuracy
    const categoryProgress = progress.map(p => ({
      category: p.category,
      totalAttempted: p.totalAttempted,
      totalCorrect: p.totalCorrect,
      accuracy: p.totalAttempted > 0 ? Math.round((p.totalCorrect / p.totalAttempted) * 100) : 0,
      avgTime: p.avgTime,
      lastPracticed: p.lastPracticed?.toISOString() || null,
    }))

    return NextResponse.json({
      readinessScore,
      totalQuestions,
      totalAnswered: totalAttempted,
      currentStreak: streak,
      categoryProgress,
      recentSessions,
      weakAreas,
    })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
