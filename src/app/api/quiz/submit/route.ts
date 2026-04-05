import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scoreAnswer } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, questionId, answer, timeSpent } = body

    // Get the question to check the answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Score the answer - always JSON stringify for consistent comparison
    const answerStr = JSON.stringify(answer)
    const isCorrect = scoreAnswer(question.type, answerStr, question.correctAnswer)

    // Store the answer
    await prisma.quizAnswer.create({
      data: {
        sessionId,
        questionId,
        answer: answerStr,
        isCorrect,
        timeSpent,
      },
    })

    // Update session
    if (isCorrect) {
      await prisma.quizSession.update({
        where: { id: sessionId },
        data: { correctQ: { increment: 1 } },
      })
    }

    // Update user progress
    const category = question.category
    await prisma.userProgress.upsert({
      where: { category },
      create: {
        category,
        totalAttempted: 1,
        totalCorrect: isCorrect ? 1 : 0,
        avgTime: timeSpent || 0,
        lastPracticed: new Date(),
      },
      update: {
        totalAttempted: { increment: 1 },
        totalCorrect: isCorrect ? { increment: 1 } : undefined,
        lastPracticed: new Date(),
      },
    })

    return NextResponse.json({
      isCorrect,
      correctAnswer: JSON.parse(question.correctAnswer),
      explanation: question.explanation,
      options: question.options ? JSON.parse(question.options) : null,
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
