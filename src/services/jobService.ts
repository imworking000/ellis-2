import { Job, JobLog, JobProgress } from '../types/job';

// Dummy data for development
let sampleJobs: Job[] = [
  {
    id: 'job-1',
    type: 'document_processing',
    title: 'Processing React Fundamentals Guide',
    status: 'completed',
    progress: 100,
    currentStage: 'Completed',
    logs: [
      {
        id: 'log-1-1',
        timestamp: '2024-01-25T10:30:00Z',
        level: 'info',
        message: 'Starting document processing...'
      },
      {
        id: 'log-1-2',
        timestamp: '2024-01-25T10:30:15Z',
        level: 'info',
        message: 'Parsing PDF content...'
      },
      {
        id: 'log-1-3',
        timestamp: '2024-01-25T10:30:45Z',
        level: 'info',
        message: 'Extracting chapters and sections...'
      },
      {
        id: 'log-1-4',
        timestamp: '2024-01-25T10:31:20Z',
        level: 'info',
        message: 'Generating content chunks...'
      },
      {
        id: 'log-1-5',
        timestamp: '2024-01-25T10:32:10Z',
        level: 'info',
        message: 'Assigning fingerprints to chunks...'
      },
      {
        id: 'log-1-6',
        timestamp: '2024-01-25T10:32:45Z',
        level: 'success',
        message: 'Document processing completed successfully!'
      }
    ],
    createdAt: '2024-01-25T10:30:00Z',
    updatedAt: '2024-01-25T10:32:45Z',
    completedAt: '2024-01-25T10:32:45Z',
    associatedId: 'doc-1',
    associatedType: 'document',
    associatedName: 'React Fundamentals Guide'
  },
  {
    id: 'job-2',
    type: 'document_chunking',
    title: 'Chunking TypeScript Best Practices',
    status: 'processing',
    progress: 65,
    currentStage: 'Generating chunks',
    logs: [
      {
        id: 'log-2-1',
        timestamp: '2024-01-25T11:15:00Z',
        level: 'info',
        message: 'Starting document chunking process...'
      },
      {
        id: 'log-2-2',
        timestamp: '2024-01-25T11:15:30Z',
        level: 'info',
        message: 'Analyzing document structure...'
      },
      {
        id: 'log-2-3',
        timestamp: '2024-01-25T11:16:15Z',
        level: 'info',
        message: 'Creating semantic chunks...'
      },
      {
        id: 'log-2-4',
        timestamp: '2024-01-25T11:17:00Z',
        level: 'info',
        message: 'Processing chapter: TypeScript Fundamentals'
      },
      {
        id: 'log-2-5',
        timestamp: '2024-01-25T11:17:45Z',
        level: 'info',
        message: 'Processing chapter: Advanced Patterns'
      }
    ],
    createdAt: '2024-01-25T11:15:00Z',
    updatedAt: '2024-01-25T11:17:45Z',
    associatedId: 'doc-2',
    associatedType: 'document',
    associatedName: 'TypeScript Best Practices'
  },
  {
    id: 'job-3',
    type: 'test_creation',
    title: 'Creating test for API Design Guidelines',
    status: 'failed',
    progress: 30,
    currentStage: 'Failed',
    logs: [
      {
        id: 'log-3-1',
        timestamp: '2024-01-25T09:45:00Z',
        level: 'info',
        message: 'Starting test creation...'
      },
      {
        id: 'log-3-2',
        timestamp: '2024-01-25T09:45:30Z',
        level: 'info',
        message: 'Analyzing document content...'
      },
      {
        id: 'log-3-3',
        timestamp: '2024-01-25T09:46:15Z',
        level: 'warning',
        message: 'Low content quality detected in some sections'
      },
      {
        id: 'log-3-4',
        timestamp: '2024-01-25T09:47:00Z',
        level: 'error',
        message: 'Failed to generate questions: Insufficient content depth'
      }
    ],
    createdAt: '2024-01-25T09:45:00Z',
    updatedAt: '2024-01-25T09:47:00Z',
    associatedId: 'doc-3',
    associatedType: 'document',
    associatedName: 'API Design Guidelines',
    error: 'Failed to generate questions: Insufficient content depth'
  },
  {
    id: 'job-4',
    type: 'document_processing',
    title: 'Processing Machine Learning Basics',
    status: 'pending',
    progress: 0,
    currentStage: 'Queued',
    logs: [
      {
        id: 'log-4-1',
        timestamp: '2024-01-25T11:20:00Z',
        level: 'info',
        message: 'Job queued for processing...'
      }
    ],
    createdAt: '2024-01-25T11:20:00Z',
    updatedAt: '2024-01-25T11:20:00Z',
    associatedId: 'doc-4',
    associatedType: 'document',
    associatedName: 'Machine Learning Basics'
  }
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const jobService = {
  async getAllJobs(): Promise<Job[]> {
    await delay(300);
    return [...sampleJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getJob(id: string): Promise<Job | null> {
    await delay(200);
    return sampleJobs.find(job => job.id === id) || null;
  },

  async getJobProgress(id: string): Promise<JobProgress | null> {
    await delay(100);
    const job = sampleJobs.find(job => job.id === id);
    if (!job) return null;
    
    return {
      jobId: job.id,
      progress: job.progress,
      currentStage: job.currentStage,
      logs: job.logs,
      status: job.status
    };
  },

  async cancelJob(id: string): Promise<void> {
    await delay(300);
    const jobIndex = sampleJobs.findIndex(job => job.id === id);
    if (jobIndex !== -1 && sampleJobs[jobIndex].status === 'processing') {
      sampleJobs[jobIndex].status = 'failed';
      sampleJobs[jobIndex].error = 'Job cancelled by user';
      sampleJobs[jobIndex].updatedAt = new Date().toISOString();
    }
  },

  async retryJob(id: string): Promise<void> {
    await delay(300);
    const jobIndex = sampleJobs.findIndex(job => job.id === id);
    if (jobIndex !== -1 && sampleJobs[jobIndex].status === 'failed') {
      sampleJobs[jobIndex].status = 'pending';
      sampleJobs[jobIndex].progress = 0;
      sampleJobs[jobIndex].currentStage = 'Queued';
      sampleJobs[jobIndex].error = undefined;
      sampleJobs[jobIndex].updatedAt = new Date().toISOString();
    }
  },

  async createDocumentProcessingJob(documentId: string, documentName: string): Promise<Job> {
    await delay(100);
    const newJob: Job = {
      id: `job-${Date.now()}`,
      type: 'document_processing',
      title: `Processing ${documentName}`,
      status: 'processing',
      progress: 0,
      currentStage: 'Parsing document content...',
      logs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Starting document processing...'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      associatedId: documentId,
      associatedType: 'document',
      associatedName: documentName
    };
    
    sampleJobs.push(newJob);
    
    // Simulate processing stages
    this.simulateJobProgress(newJob.id);
    
    return newJob;
  },

  async createTestCreationJob(testId: string, testName: string): Promise<Job> {
    await delay(100);
    const newJob: Job = {
      id: `job-${Date.now()}`,
      type: 'test_creation',
      title: `Creating test: ${testName}`,
      status: 'processing',
      progress: 0,
      currentStage: 'Analyzing selected content...',
      logs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Starting test creation...'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      associatedId: testId,
      associatedType: 'test',
      associatedName: testName
    };
    
    sampleJobs.push(newJob);
    
    // Simulate test creation stages
    this.simulateTestCreationProgress(newJob.id);
    
    return newJob;
  },

  async simulateJobProgress(jobId: string): Promise<void> {
    const stages = [
      { progress: 20, stage: 'Extracting text content...', delay: 1000 },
      { progress: 40, stage: 'Analyzing document structure...', delay: 1500 },
      { progress: 60, stage: 'Creating chapters and sections...', delay: 1000 },
      { progress: 80, stage: 'Generating metadata...', delay: 1000 },
      { progress: 100, stage: 'Completed', delay: 500 }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      
      const jobIndex = sampleJobs.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        sampleJobs[jobIndex].progress = stage.progress;
        sampleJobs[jobIndex].currentStage = stage.stage;
        sampleJobs[jobIndex].updatedAt = new Date().toISOString();
        
        // Add log entry
        sampleJobs[jobIndex].logs.push({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: stage.progress === 100 ? 'success' : 'info',
          message: stage.stage
        });
        
        if (stage.progress === 100) {
          sampleJobs[jobIndex].status = 'completed';
          sampleJobs[jobIndex].completedAt = new Date().toISOString();
        }
      }
    }
  },

  async simulateTestCreationProgress(jobId: string): Promise<void> {
    const stages = [
      { progress: 15, stage: 'Analyzing document content...', delay: 1000 },
      { progress: 30, stage: 'Extracting relevant chapters...', delay: 1500 },
      { progress: 50, stage: 'Generating questions...', delay: 2000 },
      { progress: 70, stage: 'Validating question quality...', delay: 1500 },
      { progress: 90, stage: 'Finalizing test structure...', delay: 1000 },
      { progress: 100, stage: 'Completed', delay: 500 }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      
      const jobIndex = sampleJobs.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        sampleJobs[jobIndex].progress = stage.progress;
        sampleJobs[jobIndex].currentStage = stage.stage;
        sampleJobs[jobIndex].updatedAt = new Date().toISOString();
        
        // Add log entry
        sampleJobs[jobIndex].logs.push({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: stage.progress === 100 ? 'success' : 'info',
          message: stage.stage
        });
        
        if (stage.progress === 100) {
          sampleJobs[jobIndex].status = 'completed';
          sampleJobs[jobIndex].completedAt = new Date().toISOString();
        }
      }
    }
  }
};