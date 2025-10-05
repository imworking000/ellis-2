export interface PlannedTest {
  id: string;
  testId: string;
  testName: string;
  slug: string;
  code: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  timeWindow: number; // duration in minutes
  attendees: number;
  responsibleManager: string;
  status: 'planned' | 'in_progress' | 'finished';
  createdAt: string;
  updatedAt: string;
  results?: TestResult[];
  description?: string;
}

export interface TestResult {
  id: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers: TestAnswer[];
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
}

export interface TestAnswer {
  questionId: string;
  questionText: string;
  selectedOption: {
    id: string;
    text: string;
  };
  correctOption: {
    id: string;
    text: string;
  };
  allOptions: Array<{
    id: string;
    text: string;
  }>;
  selectedOptionId: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface PlannedTestFormData {
  testId: string;
  code: string;
  scheduledDate: string;
  startTime: string;
  timeWindow: number;
  attendees: number;
  responsibleManager: string;
  description?: string;
}