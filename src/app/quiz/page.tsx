"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS } from "@/types"
import type { QuizCategory } from "@/types"
import { Suspense } from "react"

const categories = Object.keys(CATEGORY_LABELS) as QuizCategory[]

function QuizCategorySelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = searchParams.get('category')

  if (preselected) {
    router.push(`/quiz/${preselected}`)
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose a Quiz Category</h1>
        <p className="text-muted-foreground">
          Select a category to practice. Each quiz contains 10 questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category}
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
            onClick={() => router.push(`/quiz/${category}`)}
          >
            <CardHeader>
              <div className="text-3xl mb-2">{CATEGORY_ICONS[category]}</div>
              <CardTitle className="text-lg">{CATEGORY_LABELS[category]}</CardTitle>
              <CardDescription className="text-sm">
                {CATEGORY_DESCRIPTIONS[category]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-xs">
                Start Practice
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <QuizCategorySelector />
    </Suspense>
  )
}
