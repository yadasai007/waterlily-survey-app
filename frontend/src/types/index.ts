export interface User {
  id: number
  email: string
  createdAt?: string
}

export interface Survey {
  id: number
  title: string
  description?: string
  createdAt: string
  questions: Question[]
}

export interface Question {
  id: number
  surveyId: number
  title: string
  description?: string
  type: string
  required: boolean
  orderIndex: number
}

export interface Response {
  id: number
  userId: number
  surveyId: number
  submittedAt: string
  answers: Answer[]
  survey?: Survey
}

export interface Answer {
  id: number
  responseId: number
  questionId: number
  value: string
  question?: Question
}
export interface Question {
  id: number;
  surveyId: number;
  title: string;
  description?: string;
  type: string;
  required: boolean;
  orderIndex: number;
  options?: string; // JSON string of options
}
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}