export function scoreMultipleChoice(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer === correctAnswer
}

export function scoreRanking(userRanking: string[], correctRanking: string[]): boolean {
  if (userRanking.length !== correctRanking.length) return false
  return userRanking.every((item, index) => item === correctRanking[index])
}

export function scoreRating(userRating: number, correctRating: number, tolerance: number = 1): boolean {
  return Math.abs(userRating - correctRating) <= tolerance
}

export function scoreTrueFalse(userAnswer: boolean, correctAnswer: boolean): boolean {
  return userAnswer === correctAnswer
}

export function scoreMultiSelect(userSelections: string[], correctSelections: string[]): boolean {
  if (userSelections.length !== correctSelections.length) return false
  const sortedUser = [...userSelections].sort()
  const sortedCorrect = [...correctSelections].sort()
  return sortedUser.every((item, index) => item === sortedCorrect[index])
}

export function scoreStepVerification(
  userVerifications: Record<string, boolean>,
  correctVerifications: Record<string, boolean>
): boolean {
  const keys = Object.keys(correctVerifications)
  return keys.every((key) => userVerifications[key] === correctVerifications[key])
}

export function scoreAnswer(
  type: string,
  userAnswer: string,
  correctAnswerStr: string
): boolean {
  try {
    const correctAnswer = JSON.parse(correctAnswerStr)
    const parsed = JSON.parse(userAnswer)

    switch (type) {
      case 'multiple_choice':
        return scoreMultipleChoice(parsed, correctAnswer)
      case 'ranking':
        return scoreRanking(parsed, correctAnswer)
      case 'rating':
        return scoreRating(parsed, correctAnswer)
      case 'true_false':
        return scoreTrueFalse(parsed, correctAnswer)
      case 'multi_select':
        return scoreMultiSelect(parsed, correctAnswer)
      case 'step_verification':
        return scoreStepVerification(parsed, correctAnswer)
      case 'code_review':
        return scoreMultipleChoice(parsed, correctAnswer)
      case 'free_text':
        // Free text is always scored as correct for practice; Claude API evaluates in real mode
        return true
      default:
        return false
    }
  } catch {
    return false
  }
}

export function calculateSessionScore(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getPassFailStatus(score: number, threshold: number = 80): boolean {
  return score >= threshold
}

export function getGrade(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'B+'
  if (score >= 80) return 'B'
  if (score >= 75) return 'C+'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}
