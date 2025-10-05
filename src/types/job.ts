export interface Job {
  id: string;
  type: 'document_processing' | 'test_creation' | 'document_chunking';
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStage: string;
  logs: JobLog[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  associatedId?: string; // Document ID or Test ID
  associatedType?: 'document' | 'test';
  associatedName?: string;
  error?: string;
}

export interface JobLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface JobProgress {
  jobId: string;
  progress: number;
  currentStage: string;
  logs: JobLog[];
  status: Job['status'];
}