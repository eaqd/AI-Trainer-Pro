"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, X, Minus } from "lucide-react"

interface Option {
  id: string
  label: string
  text: string
}

interface StepVerificationProps {
  options: Option[]
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: Record<string, boolean>
  userAnswer?: Record<string, boolean>
}

export function StepVerification({
  options,
  onSubmit,
  disabled = false,
  showResult = false,
  correctAnswer,
  userAnswer,
}: StepVerificationProps) {
  const [verifications, setVerifications] = useState<Record<string, boolean | null>>({})

  const toggle = (id: string) => {
    if (disabled) return
    setVerifications(prev => {
      const current = prev[id]
      if (current === null || current === undefined) return { ...prev, [id]: true }
      if (current === true) return { ...prev, [id]: false }
      return { ...prev, [id]: null }
    })
  }

  const handleSubmit = () => {
    const result: Record<string, boolean> = {}
    options.forEach(o => {
      result[o.id] = verifications[o.id] ?? true
    })
    onSubmit(JSON.stringify(result))
  }

  const allVerified = options.every(o => verifications[o.id] !== undefined && verifications[o.id] !== null)

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Mark each step as correct or incorrect. Click to toggle.
      </p>
      {options.map((step) => {
        const status = verifications[step.id]
        const correctStatus = correctAnswer?.[step.id]
        const userStatus = userAnswer?.[step.id]
        const isMatch = showResult && correctStatus === userStatus
        const isMismatch = showResult && correctStatus !== userStatus

        return (
          <button
            key={step.id}
            onClick={() => toggle(step.id)}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all",
              !disabled && "cursor-pointer",
              !showResult && status === true && "border-green-500 bg-green-50 dark:bg-green-950/20",
              !showResult && status === false && "border-red-500 bg-red-50 dark:bg-red-950/20",
              !showResult && (status === null || status === undefined) && "border-border hover:border-muted-foreground/50",
              isMatch && "border-green-500 bg-green-50 dark:bg-green-950/20",
              isMismatch && "border-red-500 bg-red-50 dark:bg-red-950/20",
              disabled && "cursor-default",
            )}
            disabled={disabled}
          >
            <div className="flex items-start gap-3">
              <span className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                status === true && "bg-green-500 text-white",
                status === false && "bg-red-500 text-white",
                (status === null || status === undefined) && "bg-muted text-muted-foreground",
              )}>
                {status === true && <Check className="w-4 h-4" />}
                {status === false && <X className="w-4 h-4" />}
                {(status === null || status === undefined) && <Minus className="w-4 h-4" />}
              </span>
              <div className="flex-1">
                <span className="text-sm font-medium">{step.label}</span>
                <p className="text-sm text-muted-foreground mt-1">{step.text}</p>
              </div>
            </div>
            {showResult && correctStatus !== undefined && (
              <div className="mt-2 ml-9 text-xs">
                <span className={cn(
                  correctStatus ? "text-green-600" : "text-red-600"
                )}>
                  Correct: {correctStatus ? "Correct step" : "Incorrect step"}
                </span>
              </div>
            )}
          </button>
        )
      })}
      {!disabled && (
        <Button onClick={handleSubmit} disabled={!allVerified} className="w-full mt-4">
          Submit Verification
        </Button>
      )}
    </div>
  )
}
