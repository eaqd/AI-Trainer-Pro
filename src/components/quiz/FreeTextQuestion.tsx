"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FreeTextQuestionProps {
  onSubmit: (answer: string) => void
  disabled?: boolean
  placeholder?: string
}

export function FreeTextQuestion({
  onSubmit,
  disabled = false,
  placeholder = "Type your answer here...",
}: FreeTextQuestionProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim()) onSubmit(JSON.stringify(text.trim()))
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
        className="font-mono text-sm"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {text.length} characters
        </span>
        <Button onClick={handleSubmit} disabled={!text.trim() || disabled}>
          Submit Answer
        </Button>
      </div>
    </div>
  )
}
