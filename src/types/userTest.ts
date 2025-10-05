export interface UserTestSession {
  id: string;
  testId: string;
  userId: string;
  testName: string;
  userName: string;
  startedAt: string;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  status: 'in_progress' | 'completed';
  timeRemaining: number;
  totalQuestions: number;
  attemptNumber: number;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  answeredAt: string;
}

export interface UserTestQuestion {
  id: string;
  question: string;
  options: UserTestOption[];
  points: number;
}

export interface UserTestOption {
  id: string;
  text: string;
}

export interface UserTestLogin {
  username: string;
  password: string;
}

export interface UserTestResult {
  score: number;
  pointsEarned: number;
  totalPoints: number;
  passed: boolean;
  completedAt: string;
  duration: string;
  certificateId?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface UserTestAssignment {
  testId: string;
  testName: string;
  status: 'active' | 'inactive';
  lastAttempt?: {
    completedAt: string;
    passed: boolean;
    canRetry: boolean;
    nextRetryAt?: string;
  };
  attemptsUsed: number;
  maxAttempts: number;
}
