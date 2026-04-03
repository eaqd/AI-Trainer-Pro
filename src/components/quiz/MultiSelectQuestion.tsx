"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface Option {
  id: string
  label: string
  text: string
}

interface MultiSelectQuestionProps {
  options: Option[]
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: string[]
  userAnswer?: string[]
}

export function MultiSelectQuestion({
  options,
  onSubmit,
  disabled = false,
  showResult = false,
  correctAnswer,
  userAnswer,
}: MultiSelectQuestionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    if (disabled) return
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const handleSubmit = () => {
    onSubmit(JSON.stringify(Array.from(selected)))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Select all that apply:</p>
      {options.map((option) => {
        const isInCorrect = correctAnswer?.includes(option.id)
        const isInUser = userAnswer?.includes(option.id)
        const isCorrectlySelected = showResult && isInCorrect && isInUser
        const isMissed = showResult && isInCorrect && !isInUser
        const isWronglySelected = showResult && !isInCorrect && isInUser
        const isChecked = selected.has(option.id)

        return (
          <button
            key={option.id}
            onClick={() => toggle(option.id)}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all",
              !disabled && !showResult && "hover:border-primary/50 cursor-pointer",
              isChecked && !showResult && "border-primary bg-primary/5",
              !isChecked && !showResult && "border-border",
              isCorrectlySelected && "border-green-500 bg-green-50 dark:bg-green-950/20",
              isMissed && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
              isWronglySelected && "border-red-500 bg-red-50 dark:bg-red-950/20",
              disabled && "cursor-default",
            )}
            disabled={disabled}
          >
            <div className="flex items-start gap-3">
              <span className={cn(
                "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5",
                (isChecked || isCorrectlySelected) && "bg-primary border-primary text-primary-foreground",
                isMissed && "bg-yellow-500 border-yellow-500 text-white",
                isWronglySelected && "bg-red-500 border-red-500 text-white",
              )}>
                {(isChecked || isCorrectlySelected || isMissed || isWronglySelected) && (
                  <Check className="w-3 h-3" />
                )}
              </span>
              <span className="text-sm leading-relaxed">{option.text}</span>
            </div>
          </button>
        )
      })}
      {!disabled && (
        <Button onClick={handleSubmit} disabled={selected.size === 0} className="w-full mt-4">
          Submit Answer (Enter)
        </Button>
      )}
    </div>
  )
}
