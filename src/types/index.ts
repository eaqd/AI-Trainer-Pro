export type QuizCategory =
  | 'prompt_rating'
  | 'response_comparison'
  | 'prompt_writing'
  | 'code_review'
  | 'hallucination_detection'
  | 'safety_assessment'
  | 'instruction_following'
  | 'math_reasoning'
  | 'text_quality'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type QuestionType =
  | 'multiple_choice'
  | 'ranking'
  | 'rating'
  | 'free_text'
  | 'code_review'
  | 'true_false'
  | 'multi_select'
  | 'step_verification'

export type QuizMode = 'practice' | 'exam' | 'daily'

export interface QuestionOption {
  id: string
  label: string
  text: string
}

export interface Question {
  id: string
  category: QuizCategory
  difficulty: Difficulty
  type: QuestionType
  prompt: string
  context?: string | null
  options?: QuestionOption[]
  correctAnswer: string | string[] | number | number[] | Record<string, boolean>
  explanation: string
  rubric?: string | null
  tags: string[]
  timeLimit?: number | null
  platformRelevance: string[]
}

export interface QuizSession {
  id: string
  category: QuizCategory | null
  mode: QuizMode
  score: number | null
  totalQ: number
  correctQ: number
  duration: number | null
  completed: boolean
  startedAt: string
  completedAt: string | null
}

export interface QuizAnswer {
  id: string
  sessionId: string
  questionId: string
  answer: string
  isCorrect: boolean
  timeSpent: number | null
}

export interface CategoryProgress {
  category: QuizCategory
  totalAttempted: number
  totalCorrect: number
  accuracy: number
  avgTime: number
  lastPracticed: string | null
}

export interface DashboardData {
  readinessScore: number
  totalQuestions: number
  totalAnswered: number
  currentStreak: number
  categoryProgress: CategoryProgress[]
  recentSessions: QuizSession[]
  weakAreas: { category: QuizCategory; accuracy: number }[]
}

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  prompt_rating: 'Prompt & Response Rating',
  response_comparison: 'Response Comparison',
  prompt_writing: 'Prompt Writing',
  code_review: 'Code Review',
  hallucination_detection: 'Hallucination Detection',
  safety_assessment: 'Safety Assessment',
  instruction_following: 'Instruction Following',
  math_reasoning: 'Math & Reasoning',
  text_quality: 'Text Quality',
}

export const CATEGORY_ICONS: Record<QuizCategory, string> = {
  prompt_rating: '⭐',
  response_comparison: '⚖️',
  prompt_writing: '✍️',
  code_review: '💻',
  hallucination_detection: '🔍',
  safety_assessment: '🛡️',
  instruction_following: '📋',
  math_reasoning: '🧮',
  text_quality: '📝',
}

export const CATEGORY_DESCRIPTIONS: Record<QuizCategory, string> = {
  prompt_rating: 'Rate AI responses on helpfulness, accuracy, safety, and relevance',
  response_comparison: 'Compare and rank multiple AI responses side by side',
  prompt_writing: 'Write and improve prompts for AI systems',
  code_review: 'Review code for bugs, style issues, and best practices',
  hallucination_detection: 'Identify false claims and fabricated information in AI outputs',
  safety_assessment: 'Evaluate content for safety concerns and harmful material',
  instruction_following: 'Assess whether AI responses follow all given instructions',
  math_reasoning: 'Verify mathematical solutions and logical reasoning',
  text_quality: 'Evaluate writing quality, grammar, coherence, and style',
}
