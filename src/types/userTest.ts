export interface UserTestSession {
  id: string;
  plannedTestId: string;
  testCode: string;
  testName: string;
  attendeeName: string;
  attendeeEmail: string;
  startedAt: string;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  status: 'in_progress' | 'completed';
  timeRemaining: number; // in seconds
  totalQuestions: number;
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
}

export interface UserTestOption {
  id: string;
  text: string;
}

export interface UserTestLogin {
  testCode: string;
  firstName: string;
  lastName: string;
}

export interface UserTestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  duration: string;
}