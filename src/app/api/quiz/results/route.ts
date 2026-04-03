import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Mark session as completed if not already
    if (!session.completed) {
      const score = session.totalQ > 0
        ? Math.round((session.correctQ / session.totalQ) * 100)
        : 0

      await prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          completed: true,
          completedAt: new Date(),
          score,
        },
      })
      session.score = score
      session.completed = true
    }

    // Format answers with question details
    const results = session.answers.map((a) => ({
      questionId: a.questionId,
      prompt: a.question.prompt,
      context: a.question.context,
      type: a.question.type,
      userAnswer: JSON.parse(a.answer),
      correctAnswer: JSON.parse(a.question.correctAnswer),
      isCorrect: a.isCorrect,
      explanation: a.question.explanation,
      options: a.question.options ? JSON.parse(a.question.options) : null,
      timeSpent: a.timeSpent,
      difficulty: a.question.difficulty,
      category: a.question.category,
    }))

    return NextResponse.json({
      session: {
        id: session.id,
        category: session.category,
        mode: session.mode,
        score: session.score,
        totalQ: session.totalQ,
        correctQ: session.correctQ,
        duration: session.duration,
        completed: session.completed,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
      },
      results,
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}
