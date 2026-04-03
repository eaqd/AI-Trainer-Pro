import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const CATEGORIES = [
  'prompt_rating', 'response_comparison', 'prompt_writing', 'code_review',
  'hallucination_detection', 'safety_assessment', 'instruction_following',
  'math_reasoning', 'text_quality',
]

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Check if today's challenge exists
    let challenge = await prisma.dailyChallenge.findUnique({
      where: { date: today },
    })

    if (!challenge) {
      // Determine category based on day of year
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
      )
      const category = CATEGORIES[dayOfYear % CATEGORIES.length]

      // Pick a random question from that category
      const questions = await prisma.question.findMany({
        where: { category },
        select: { id: true },
      })

      if (questions.length === 0) {
        return NextResponse.json({ error: 'No questions available' }, { status: 404 })
      }

      const randomQ = questions[Math.floor(Math.random() * questions.length)]

      challenge = await prisma.dailyChallenge.create({
        data: {
          date: today,
          questionId: randomQ.id,
          category,
        },
      })
    }

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: challenge.questionId },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Get streak info
    const challenges = await prisma.dailyChallenge.findMany({
      where: { completed: true },
      orderBy: { date: 'desc' },
    })

    let streak = 0
    const todayDate = new Date(today)
    for (const c of challenges) {
      const expectedDate = new Date(todayDate)
      expectedDate.setDate(expectedDate.getDate() - streak)
      if (c.date === expectedDate.toISOString().split('T')[0]) {
        streak++
      } else {
        // Also check yesterday if today isn't complete yet
        if (streak === 0 && !challenge.completed) {
          expectedDate.setDate(expectedDate.getDate() - 1)
          if (c.date === expectedDate.toISOString().split('T')[0]) {
            streak++
            continue
          }
        }
        break
      }
    }

    return NextResponse.json({
      challenge: {
        ...challenge,
        streak,
      },
      question: {
        ...question,
        options: question.options ? JSON.parse(question.options) : null,
        tags: JSON.parse(question.tags),
        platformRelevance: JSON.parse(question.platformRelevance),
        correctAnswer: challenge.completed ? JSON.parse(question.correctAnswer) : undefined,
        explanation: challenge.completed ? question.explanation : undefined,
      },
    })
  } catch (error) {
    console.error('Error fetching daily challenge:', error)
    return NextResponse.json({ error: 'Failed to fetch daily challenge' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, answer, questionId } = body

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const correctAnswer = JSON.parse(question.correctAnswer)
    const userAnswer = typeof answer === 'string' ? JSON.parse(answer) : answer
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)

    await prisma.dailyChallenge.update({
      where: { date },
      data: {
        completed: true,
        score: isCorrect ? 100 : 0,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      explanation: question.explanation,
      score: isCorrect ? 100 : 0,
    })
  } catch (error) {
    console.error('Error submitting daily challenge:', error)
    return NextResponse.json({ error: 'Failed to submit daily challenge' }, { status: 500 })
  }
}
