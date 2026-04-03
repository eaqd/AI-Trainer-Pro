import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, mode = 'practice', questionCount = 10 } = body

    // Get questions for the category
    const where = category ? { category } : {}
    const questions = await prisma.question.findMany({
      where,
      select: { id: true },
    })

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found for this category' }, { status: 404 })
    }

    // Create session
    const session = await prisma.quizSession.create({
      data: {
        category: category || null,
        mode,
        totalQ: Math.min(questionCount, questions.length),
        completed: false,
      },
    })

    // Shuffle and select questions
    const shuffled = questions.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount, questions.length))

    // Fetch full question data
    const fullQuestions = await prisma.question.findMany({
      where: { id: { in: selected.map(q => q.id) } },
    })

    return NextResponse.json({
      session,
      questions: fullQuestions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null,
        tags: JSON.parse(q.tags),
        platformRelevance: JSON.parse(q.platformRelevance),
        // Don't send correct answer to client during quiz
        correctAnswer: undefined,
        explanation: undefined,
      })),
    })
  } catch (error) {
    console.error('Error starting quiz:', error)
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 })
  }
}
