import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category')
    const difficulty = request.nextUrl.searchParams.get('difficulty')

    const where: Record<string, string> = {}
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty

    const questions = await prisma.question.findMany({
      where,
      select: {
        id: true,
        category: true,
        difficulty: true,
        type: true,
        prompt: true,
        context: true,
        options: true,
        tags: true,
        timeLimit: true,
        platformRelevance: true,
      },
    })

    const formatted = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
      tags: JSON.parse(q.tags),
      platformRelevance: JSON.parse(q.platformRelevance),
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
