import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { id: 'default' },
      })
    }

    return NextResponse.json({
      ...settings,
      focusCategories: JSON.parse(settings.focusCategories),
      apiKey: settings.apiKey ? '••••••••' : null,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { darkMode, difficulty, dailyGoal, focusCategories, apiKey, timeGoal } = body

    const data: Record<string, unknown> = {}
    if (darkMode !== undefined) data.darkMode = darkMode
    if (difficulty !== undefined) data.difficulty = difficulty
    if (dailyGoal !== undefined) data.dailyGoal = dailyGoal
    if (focusCategories !== undefined) data.focusCategories = JSON.stringify(focusCategories)
    if (apiKey !== undefined) data.apiKey = apiKey
    if (timeGoal !== undefined) data.timeGoal = timeGoal

    const settings = await prisma.userSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...data },
      update: data,
    })

    return NextResponse.json({
      ...settings,
      focusCategories: JSON.parse(settings.focusCategories),
      apiKey: settings.apiKey ? '••••••••' : null,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
