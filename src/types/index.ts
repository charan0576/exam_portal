export interface User {
  id: string;
  name: string;
  regno: string;
  role: 'student' | 'admin';
}

export interface Question {
  _id: string;
  category: string;
  subcategory: string;
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface TestResult {
  _id: string;
  userId: string;
  category: string;
  subcategory: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  submittedAt: string;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface Ranking {
  _id: string;
  name: string;
  regno: string;
  totalScore: number;
  totalQuestions: number;
  testsCount: number;
  percentage: number;
}