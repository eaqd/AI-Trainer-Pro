"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MultipleChoice } from "./MultipleChoice"
import { RatingQuestion } from "./RatingQuestion"
import { RankingQuestion } from "./RankingQuestion"
import { TrueFalseQuestion } from "./TrueFalseQuestion"
import { MultiSelectQuestion } from "./MultiSelectQuestion"
import { FreeTextQuestion } from "./FreeTextQuestion"
import { CodeReviewQuestion } from "./CodeReviewQuestion"
import { StepVerification } from "./StepVerification"
import { CATEGORY_LABELS } from "@/types"
import type { QuizCategory } from "@/types"

interface QuestionOption {
  id: string
  label: string
  text: string
}

interface QuizCardProps {
  question: {
    id: string
    category: string
    difficulty: string
    type: string
    prompt: string
    context?: string | null
    options?: QuestionOption[] | null
  }
  onSubmit: (answer: string) => void
  disabled?: boolean
  showResult?: boolean
  result?: {
    isCorrect: boolean
    correctAnswer: unknown
    explanation: string
    userAnswer?: unknown
  } | null
}

export function QuizCard({ question, onSubmit, disabled = false, showResult = false, result }: QuizCardProps) {
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }[question.difficulty] || ''

  const renderQuestionInput = () => {
    const options = question.options || []

    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            options={options}
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as string}
            userAnswer={result?.userAnswer as string}
          />
        )
      case 'rating':
        return (
          <RatingQuestion
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as number}
            userAnswer={result?.userAnswer as number}
          />
        )
      case 'ranking':
        return (
          <RankingQuestion
            options={options}
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as string[]}
            userAnswer={result?.userAnswer as string[]}
          />
        )
      case 'true_false':
        return (
          <TrueFalseQuestion
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as boolean}
            userAnswer={result?.userAnswer as boolean}
          />
        )
      case 'multi_select':
        return (
          <MultiSelectQuestion
            options={options}
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as string[]}
            userAnswer={result?.userAnswer as string[]}
          />
        )
      case 'free_text':
        return (
          <FreeTextQuestion
            onSubmit={onSubmit}
            disabled={disabled}
          />
        )
      case 'code_review':
        return (
          <CodeReviewQuestion
            options={options}
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as string}
            userAnswer={result?.userAnswer as string}
          />
        )
      case 'step_verification':
        return (
          <StepVerification
            options={options}
            onSubmit={onSubmit}
            disabled={disabled}
            showResult={showResult}
            correctAnswer={result?.correctAnswer as Record<string, boolean>}
            userAnswer={result?.userAnswer as Record<string, boolean>}
          />
        )
      default:
        return <p>Unknown question type: {question.type}</p>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            {CATEGORY_LABELS[question.category as QuizCategory] || question.category}
          </Badge>
          <Badge className={difficultyColor} variant="outline">
            {question.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-relaxed">{question.prompt}</CardTitle>
        {question.context && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Context:</p>
            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{question.context}</pre>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderQuestionInput()}

        {showResult && result && (
          <div className={`mt-6 p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'}`}>
            <p className={`font-semibold mb-2 ${result.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {result.isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-sm leading-relaxed">{result.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
