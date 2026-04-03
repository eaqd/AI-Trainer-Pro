"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"

interface Option {
  id: string
  label: string
  text: string
}

interface RankingQuestionProps {
  options: Option[]
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: string[]
  userAnswer?: string[]
}

export function RankingQuestion({
  options,
  onSubmit,
  disabled = false,
  showResult = false,
  correctAnswer,

}: RankingQuestionProps) {
  const [ranked, setRanked] = useState<Option[]>([...options])

  const moveUp = (index: number) => {
    if (index === 0 || disabled) return
    const newRanked = [...ranked];
    [newRanked[index - 1], newRanked[index]] = [newRanked[index], newRanked[index - 1]]
    setRanked(newRanked)
  }

  const moveDown = (index: number) => {
    if (index === ranked.length - 1 || disabled) return
    const newRanked = [...ranked];
    [newRanked[index], newRanked[index + 1]] = [newRanked[index + 1], newRanked[index]]
    setRanked(newRanked)
  }

  const handleSubmit = () => {
    onSubmit(JSON.stringify(ranked.map(r => r.id)))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-2">
        Rank from best (top) to worst (bottom). Use arrows to reorder.
      </p>
      {ranked.map((option, index) => {
        const correctPos = correctAnswer?.indexOf(option.id)
        const isCorrectPosition = showResult && correctPos === index
        const isWrongPosition = showResult && correctPos !== index

        return (
          <div
            key={option.id}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
              !showResult && "border-border",
              isCorrectPosition && "border-green-500 bg-green-50 dark:bg-green-950/20",
              isWrongPosition && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
            )}
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <span className="flex-1 text-sm">{option.text}</span>
            {!disabled && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveUp(index)}
                  className="p-1 hover:bg-muted rounded"
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  className="p-1 hover:bg-muted rounded"
                  disabled={index === ranked.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
            {showResult && correctPos !== undefined && (
              <span className="text-xs text-muted-foreground">
                Correct: #{correctPos + 1}
              </span>
            )}
          </div>
        )
      })}
      {!disabled && (
        <Button onClick={handleSubmit} className="w-full mt-4">
          Submit Ranking (Enter)
        </Button>
      )}
    </div>
  )
}
