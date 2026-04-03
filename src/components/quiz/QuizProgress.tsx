"use client"

import { Progress } from "@/components/ui/progress"

interface QuizProgressProps {
  current: number
  total: number
  correctCount: number
}

export function QuizProgress({ current, total, correctCount }: QuizProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {current} of {total}</span>
        <span>{correctCount} correct</span>
      </div>
      <Progress value={percentage} />
    </div>
  )
}
