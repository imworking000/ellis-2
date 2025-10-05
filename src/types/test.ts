export interface Test {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'processing' | 'draft' | 'published' | 'archived';
  sourceDocuments: TestSourceDocument[];
  questions: TestQuestion[];
  maxQuestions: number;
  estimatedQuestions: number;
  hasDeprecatedContent: boolean;
  processingJobId?: string;
}

export interface TestSourceDocument {
  documentId: string;
  documentName: string;
  version: number;
  currentVersion: number;
  selectedChapters: string[];
  isDeprecated: boolean;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: TestOption[];
  correctAnswerId: string;
  sourceChapterId?: string;
  isDeprecated: boolean;
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
  maxQuestions: number;
  selectedLabels: LabelFilter[];
}

export interface LabelFilter {
  labelKey: string;
  labelName: string;
  value: string;
}

export interface TestHistory {
  id: string;
  testId: string;
  testName: string;
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  attendees: number;
  completedBy: number;
  averageScore: number;
  duration: number; // in minutes
  createdAt: string;
}

export interface QuestionEstimate {
  totalChapters: number;
  estimatedQuestions: number;
  selectedDocuments: Array<{
    documentName: string;
    chapters: number;
    questions: number;
  }>;
}