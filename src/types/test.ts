export interface Test {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'processing' | 'inactive' | 'active';
  documents: TestDocument[];
  questions: TestQuestion[];
  duration: number;
  certificateId?: string;
  minSuccessPercentage: number;
  retryCount: number;
  retryBackoffHours: number;
  processingJobId?: string;
}

export interface TestDocument {
  name: string;
  fileType: 'pdf' | 'txt';
  uploadedAt: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: TestOption[];
  correctAnswerId: string;
  points: number;
  isManual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestOption {
  id: string;
  text: string;
}

export interface TestFormData {
  name: string;
  description: string;
  questionCount: number;
  duration: number;
  certificateId?: string;
  minSuccessPercentage: number;
  retryCount: number;
  retryBackoffHours: number;
  documents: File[];
}

export interface TestAssignment {
  id: string;
  testId: string;
  userId: string;
  assignedAt: string;
  attempts: TestAttempt[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  userName: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  pointsEarned?: number;
  totalPoints?: number;
  passed: boolean;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers: TestAnswerRecord[];
  attemptNumber: number;
}

export interface TestAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  answeredAt: string;
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
}

export interface TestStatistics {
  testId: string;
  testName: string;
  totalAttempts: number;
  uniqueUsers: number;
  averageScore: number;
  passRate: number;
  attempts: TestAttemptSummary[];
}

export interface TestAttemptSummary {
  attemptId: string;
  userId: string;
  userName: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  pointsEarned?: number;
  totalPoints?: number;
  passed: boolean;
  attemptNumber: number;
  answers: TestAnswerRecord[];
}
