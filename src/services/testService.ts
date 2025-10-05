import { Test, TestQuestion, TestFormData, TestHistory, QuestionEstimate, LabelFilter } from '../types/test';

// Dummy data for development
const sampleTests: Test[] = [
  {
    id: 'test-1',
    name: 'React Fundamentals Assessment',
    description: 'Test covering basic React concepts and JSX syntax',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    status: 'published',
    sourceDocuments: [
      {
        documentId: 'doc-1',
        documentName: 'React Fundamentals Guide',
        version: 1,
        currentVersion: 2,
        selectedChapters: ['doc-1-ch1', 'doc-1-ch2'],
        isDeprecated: true
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is React primarily used for?',
        options: [
          { id: 'a', text: 'Building user interfaces' },
          { id: 'b', text: 'Database management' },
          { id: 'c', text: 'Server-side scripting' },
          { id: 'd', text: 'Mobile app development only' }
        ],
        correctAnswerId: 'a',
        sourceChapterId: 'doc-1-ch1-1',
        isDeprecated: true,
        isManual: false,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        id: 'q2',
        question: 'Which syntax does React use to describe UI elements?',
        options: [
          { id: 'a', text: 'HTML' },
          { id: 'b', text: 'JSX' },
          { id: 'c', text: 'XML' },
          { id: 'd', text: 'JSON' }
        ],
        correctAnswerId: 'b',
        sourceChapterId: 'doc-1-ch2-1',
        isDeprecated: false,
        isManual: false,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      }
    ],
    maxQuestions: 10,
    estimatedQuestions: 8,
    hasDeprecatedContent: true
  },
  {
    id: 'test-2',
    name: 'TypeScript Advanced Patterns',
    description: 'Advanced TypeScript concepts and best practices',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    status: 'draft',
    sourceDocuments: [
      {
        documentId: 'doc-2',
        documentName: 'TypeScript Best Practices',
        version: 3,
        currentVersion: 3,
        selectedChapters: ['doc-2-ch1', 'doc-2-ch2'],
        isDeprecated: false
      }
    ],
    questions: [
      {
        id: 'q3',
        question: 'What are TypeScript generics used for?',
        options: [
          { id: 'a', text: 'Type safety with reusable components' },
          { id: 'b', text: 'Runtime performance optimization' },
          { id: 'c', text: 'Database connections' },
          { id: 'd', text: 'CSS styling' }
        ],
        correctAnswerId: 'a',
        sourceChapterId: 'doc-2-ch2-1',
        isDeprecated: false,
        isManual: false,
        createdAt: '2024-01-25',
        updatedAt: '2024-01-25'
      }
    ],
    maxQuestions: 15,
    estimatedQuestions: 12,
    hasDeprecatedContent: false
  },
  {
    id: 'test-3',
    name: 'JavaScript Fundamentals Quiz',
    description: 'Basic JavaScript concepts and syntax',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
    status: 'published',
    sourceDocuments: [
      {
        documentId: 'doc-4',
        documentName: 'JavaScript Basics Guide',
        version: 1,
        currentVersion: 3,
        selectedChapters: ['doc-4-ch1', 'doc-4-ch2'],
        isDeprecated: true
      }
    ],
    questions: [
      {
        id: 'q4',
        question: 'What is the difference between let and var?',
        options: [
          { id: 'a', text: 'Block scope vs function scope' },
          { id: 'b', text: 'No difference' },
          { id: 'c', text: 'Performance optimization' },
          { id: 'd', text: 'Browser compatibility' }
        ],
        correctAnswerId: 'a',
        sourceChapterId: 'doc-4-ch1-1',
        isDeprecated: true,
        isManual: false,
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18'
      }
    ],
    maxQuestions: 8,
    estimatedQuestions: 6,
    hasDeprecatedContent: true
  }
];

const sampleTestHistory: TestHistory[] = [
  {
    id: 'hist-1',
    testId: 'test-1',
    testName: 'React Fundamentals Assessment',
    scheduledDate: '2024-01-30T10:00:00Z',
    status: 'completed',
    attendees: 25,
    completedBy: 23,
    averageScore: 78.5,
    duration: 30,
    createdAt: '2024-01-28'
  },
  {
    id: 'hist-2',
    testId: 'test-1',
    testName: 'React Fundamentals Assessment',
    scheduledDate: '2024-02-05T14:00:00Z',
    status: 'scheduled',
    attendees: 18,
    completedBy: 0,
    averageScore: 0,
    duration: 30,
    createdAt: '2024-02-01'
  },
  {
    id: 'hist-3',
    testId: 'test-2',
    testName: 'TypeScript Advanced Patterns',
    scheduledDate: '2024-02-10T09:00:00Z',
    status: 'scheduled',
    attendees: 12,
    completedBy: 0,
    averageScore: 0,
    duration: 45,
    createdAt: '2024-02-03'
  }
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const testService = {
  async getAllTests(): Promise<Test[]> {
    await delay(300);
    return [...sampleTests];
  },

  async getTest(id: string): Promise<Test | null> {
    await delay(200);
    return sampleTests.find(test => test.id === id) || null;
  },

  async createTest(testData: TestFormData): Promise<Test> {
    await delay(800);
    const newTest: Test = {
      id: `test-${Date.now()}`,
      name: testData.name,
      description: testData.description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'processing',
      sourceDocuments: [],
      questions: [],
      maxQuestions: testData.maxQuestions,
      estimatedQuestions: 0,
      hasDeprecatedContent: false,
      processingJobId: `job-${Date.now()}`
    };
    sampleTests.push(newTest);
    
    // Simulate processing completion after 8 seconds
    setTimeout(() => {
      const test = sampleTests.find(t => t.id === newTest.id);
      if (test && test.status === 'processing') {
        test.status = 'draft';
        test.processingJobId = undefined;
      }
    }, 8000);
    
    return newTest;
  },

  async updateTest(id: string, testData: Partial<Test>): Promise<Test> {
    await delay(400);
    const testIndex = sampleTests.findIndex(test => test.id === id);
    if (testIndex === -1) {
      throw new Error('Test not found');
    }
    
    const updatedTest = {
      ...sampleTests[testIndex],
      ...testData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    sampleTests[testIndex] = updatedTest;
    return updatedTest;
  },

  async deleteTest(id: string): Promise<void> {
    await delay(300);
    const testIndex = sampleTests.findIndex(test => test.id === id);
    if (testIndex === -1) {
      throw new Error('Test not found');
    }
    sampleTests.splice(testIndex, 1);
  },

  async estimateQuestions(labelFilters: LabelFilter[]): Promise<QuestionEstimate> {
    await delay(500);
    // Simulate estimation based on label filters
    const totalChapters = labelFilters.length * 3; // Mock calculation
    const estimatedQuestions = totalChapters * 2.5; // Mock calculation
    
    return {
      totalChapters,
      estimatedQuestions: Math.floor(estimatedQuestions),
      selectedDocuments: [
        {
          documentName: 'React Fundamentals Guide',
          chapters: Math.floor(totalChapters * 0.6),
          questions: Math.floor(estimatedQuestions * 0.6)
        },
        {
          documentName: 'TypeScript Best Practices',
          chapters: Math.floor(totalChapters * 0.4),
          questions: Math.floor(estimatedQuestions * 0.4)
        }
      ]
    };
  },

  async updateQuestion(testId: string, questionId: string, questionData: Partial<TestQuestion>): Promise<TestQuestion> {
    await delay(300);
    const test = sampleTests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');
    
    const questionIndex = test.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) throw new Error('Question not found');
    
    const updatedQuestion = {
      ...test.questions[questionIndex],
      ...questionData,
      updatedAt: new Date().toISOString()
    };
    
    test.questions[questionIndex] = updatedQuestion;
    return updatedQuestion;
  },

  async deleteQuestion(testId: string, questionId: string): Promise<void> {
    await delay(200);
    const test = sampleTests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');
    
    const questionIndex = test.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) throw new Error('Question not found');
    
    test.questions.splice(questionIndex, 1);
  },

  async regenerateQuestion(testId: string, questionId: string): Promise<TestQuestion> {
    await delay(1000);
    // Simulate regenerating a question
    const newQuestion: TestQuestion = {
      id: questionId,
      question: 'What is the main benefit of using React hooks?',
      options: [
        { id: 'a', text: 'Better state management in functional components' },
        { id: 'b', text: 'Faster rendering performance' },
        { id: 'c', text: 'Smaller bundle size' },
        { id: 'd', text: 'Better SEO optimization' }
      ],
      correctAnswerId: 'a',
      sourceChapterId: 'doc-1-ch1-1',
      isDeprecated: false,
      isManual: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const test = sampleTests.find(t => t.id === testId);
    if (test) {
      const questionIndex = test.questions.findIndex(q => q.id === questionId);
      if (questionIndex !== -1) {
        test.questions[questionIndex] = newQuestion;
      }
    }
    
    return newQuestion;
  },

  async addManualQuestion(testId: string): Promise<TestQuestion> {
    await delay(200);
    const newQuestion: TestQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ],
      correctAnswerId: 'a',
      isDeprecated: false,
      isManual: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const test = sampleTests.find(t => t.id === testId);
    if (test) {
      test.questions.push(newQuestion);
    }
    
    return newQuestion;
  },

  async getTestHistory(): Promise<TestHistory[]> {
    await delay(300);
    return [...sampleTestHistory].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }
};