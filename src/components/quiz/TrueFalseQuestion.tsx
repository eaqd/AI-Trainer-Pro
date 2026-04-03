"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface TrueFalseQuestionProps {
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: boolean
  userAnswer?: boolean
}

export function TrueFalseQuestion({
  onSubmit,
  disabled = false,
  showResult = false,
  correctAnswer,
  userAnswer,
}: TrueFalseQuestionProps) {
  const [selected, setSelected] = useState<boolean | null>(null)

  const handleSubmit = useCallback(() => {
    if (selected !== null) onSubmit(JSON.stringify(selected))
  }, [selected, onSubmit])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return
      if (e.key === 't' || e.key === 'T' || e.key === '1') setSelected(true)
      if (e.key === 'f' || e.key === 'F' || e.key === '2') setSelected(false)
      if (e.key === 'Enter' && selected !== null) handleSubmit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, disabled, handleSubmit])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map((value) => {
          const isCorrect = showResult && correctAnswer === value
          const isWrong = showResult && userAnswer === value && userAnswer !== correctAnswer
          const isSelected = selected === value

          return (
            <button
              key={String(value)}
              onClick={() => !disabled && setSelected(value)}
              className={cn(
                "flex flex-col items-center gap-2 p-6 rounded-lg border-2 transition-all",
                !disabled && !showResult && "hover:border-primary/50 cursor-pointer",
                isSelected && !showResult && "border-primary bg-primary/5",
                !isSelected && !showResult && "border-border",
                isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                isWrong && "border-red-500 bg-red-50 dark:bg-red-950/20",
                disabled && "cursor-default",
              )}
              disabled={disabled}
            >
              {value ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <X className="w-8 h-8 text-red-600" />
              )}
              <span className="text-lg font-medium">{value ? 'True' : 'False'}</span>
              <span className="text-xs text-muted-foreground">
                Press {value ? 'T or 1' : 'F or 2'}
              </span>
            </button>
          )
        })}
      </div>
      {!disabled && (
        <Button onClick={handleSubmit} disabled={selected === null} className="w-full">
          Submit Answer (Enter)
        </Button>
      )}
    </div>
  )
}
