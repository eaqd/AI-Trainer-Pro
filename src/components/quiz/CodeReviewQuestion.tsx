"use client"

import { MultipleChoice } from "./MultipleChoice"

interface Option {
  id: string
  label: string
  text: string
}

interface CodeReviewQuestionProps {
  options: Option[]
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  correctAnswer?: string
  userAnswer?: string
}

export function CodeReviewQuestion(props: CodeReviewQuestionProps) {
  // Code review uses the same MC interface but with code-specific styling handled by the parent
  return <MultipleChoice {...props} />
}
