"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Option {
  id: string
  label: string
  text: string
}

interface MultipleChoiceProps {
  options: Option[]
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: string
  userAnswer?: string
}

export function MultipleChoice({
  options,
  onSubmit,
  disabled = false,
  showResult = false,
  correctAnswer,
  userAnswer,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSubmit = useCallback(() => {
    if (selected) onSubmit(JSON.stringify(selected))
  }, [selected, onSubmit])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return
      const num = parseInt(e.key)
      if (num >= 1 && num <= options.length) {
        setSelected(options[num - 1].id)
      }
      if (e.key === 'Enter' && selected) {
        handleSubmit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [options, selected, disabled, handleSubmit])

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isCorrect = showResult && correctAnswer === option.id
        const isWrong = showResult && userAnswer === option.id && userAnswer !== correctAnswer
        const isSelected = selected === option.id

        return (
          <button
            key={option.id}
            onClick={() => !disabled && setSelected(option.id)}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all",
              !disabled && !showResult && "hover:border-primary/50 cursor-pointer",
              isSelected && !showResult && "border-primary bg-primary/5",
              !isSelected && !showResult && "border-border",
              isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
              isWrong && "border-red-500 bg-red-50 dark:bg-red-950/20",
              disabled && "cursor-default",
            )}
            disabled={disabled}
          >
            <div className="flex items-start gap-3">
              <span className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
                isSelected && !showResult && "bg-primary text-primary-foreground",
                isCorrect && "bg-green-500 text-white",
                isWrong && "bg-red-500 text-white",
                !isSelected && !showResult && "bg-muted text-muted-foreground",
              )}>
                {option.label || String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm leading-relaxed">{option.text}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1 block ml-10">
              Press {index + 1} to select
            </span>
          </button>
        )
      })}
      {!disabled && (
        <Button onClick={handleSubmit} disabled={!selected} className="w-full mt-4">
          Submit Answer (Enter)
        </Button>
      )}
    </div>
  )
}
