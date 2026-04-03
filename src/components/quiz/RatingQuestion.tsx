"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface RatingQuestionProps {
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: number
  userAnswer?: number
  maxRating?: number
  labels?: string[]
}

export function RatingQuestion({
  onSubmit,
  disabled = false,
  showResult = false,
  correctAnswer,
  userAnswer,
  maxRating = 5,
  labels = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'],
}: RatingQuestionProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const handleSubmit = useCallback(() => {
    if (rating !== null) onSubmit(JSON.stringify(rating))
  }, [rating, onSubmit])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return
      const num = parseInt(e.key)
      if (num >= 1 && num <= maxRating) {
        setRating(num)
      }
      if (e.key === 'Enter' && rating !== null) {
        handleSubmit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [rating, disabled, maxRating, handleSubmit])

  const displayRating = hovered ?? rating

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => {
          const isCorrectValue = showResult && correctAnswer === value
          const isWrongValue = showResult && userAnswer === value && userAnswer !== correctAnswer

          return (
            <button
              key={value}
              onClick={() => !disabled && setRating(value)}
              onMouseEnter={() => !disabled && setHovered(value)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                !disabled && "hover:bg-primary/10 cursor-pointer",
                isCorrectValue && "bg-green-50 dark:bg-green-950/20 ring-2 ring-green-500",
                isWrongValue && "bg-red-50 dark:bg-red-950/20 ring-2 ring-red-500",
              )}
              disabled={disabled}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  displayRating && value <= displayRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground",
                )}
              />
              <span className="text-xs text-muted-foreground">{value}</span>
            </button>
          )
        })}
      </div>
      {displayRating && labels[displayRating - 1] && (
        <p className="text-center text-sm font-medium">{labels[displayRating - 1]}</p>
      )}
      {showResult && correctAnswer && (
        <p className="text-center text-sm text-muted-foreground">
          Correct rating: <span className="font-bold text-green-600">{correctAnswer}</span>
          {userAnswer && userAnswer !== correctAnswer && (
            <> (Your answer: <span className="text-red-600">{userAnswer}</span>)</>
          )}
        </p>
      )}
      {!disabled && (
        <Button onClick={handleSubmit} disabled={rating === null} className="w-full">
          Submit Rating (Enter)
        </Button>
      )}
    </div>
  )
}
