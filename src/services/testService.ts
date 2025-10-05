import { Test, TestQuestion, TestFormData, TestAssignment, TestAttempt, Certificate, TestStatistics, TestAttemptSummary } from '../types/test';

const sampleCertificates: Certificate[] = [
  { id: 'cert-1', name: 'React Professional', description: 'React development certification' },
  { id: 'cert-2', name: 'TypeScript Expert', description: 'Advanced TypeScript certification' },
  { id: 'cert-3', name: 'JavaScript Fundamentals', description: 'Core JavaScript certification' }
];

const sampleTests: Test[] = [
  {
    id: 'test-1',
    name: 'React Fundamentals Assessment',
    description: 'Test covering basic React concepts and JSX syntax',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    publishedAt: '2024-01-22T10:30:00Z',
    status: 'active',
    documents: [
      { name: 'React Fundamentals Guide.pdf', fileType: 'pdf', uploadedAt: '2024-01-20' }
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
        points: 10,
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
        points: 10,
        isManual: false,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        id: 'q3',
        question: 'What is a React Hook?',
        options: [
          { id: 'a', text: 'A function that lets you use state in function components' },
          { id: 'b', text: 'A CSS styling method' },
          { id: 'c', text: 'A database query tool' },
          { id: 'd', text: 'A testing framework' }
        ],
        correctAnswerId: 'a',
        points: 10,
        isManual: false,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        id: 'q4',
        question: 'What is the virtual DOM?',
        options: [
          { id: 'a', text: 'A lightweight copy of the actual DOM' },
          { id: 'b', text: 'A CSS framework' },
          { id: 'c', text: 'A database system' },
          { id: 'd', text: 'A testing tool' }
        ],
        correctAnswerId: 'a',
        points: 10,
        isManual: false,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        id: 'q5',
        question: 'What does useState return?',
        options: [
          { id: 'a', text: 'An array with state value and setter function' },
          { id: 'b', text: 'A single state value' },
          { id: 'c', text: 'An object with multiple values' },
          { id: 'd', text: 'A promise' }
        ],
        correctAnswerId: 'a',
        points: 10,
        isManual: false,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      }
    ],
    duration: 30,
    certificateId: 'cert-1',
    minSuccessPercentage: 70,
    retryCount: 3,
    retryBackoffHours: 24
  },
  {
    id: 'test-2',
    name: 'TypeScript Advanced Patterns',
    description: 'Advanced TypeScript concepts and best practices',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    status: 'inactive',
    documents: [
      { name: 'TypeScript Best Practices.pdf', fileType: 'pdf', uploadedAt: '2024-01-25' }
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
        points: 4,
        isManual: false,
        createdAt: '2024-01-25',
        updatedAt: '2024-01-25'
      }
    ],
    duration: 45,
    certificateId: 'cert-2',
    minSuccessPercentage: 75,
    retryCount: 2,
    retryBackoffHours: 48
  }
];

const sampleTestAssignments: TestAssignment[] = [
  {
    id: 'assign-1',
    testId: 'test-1',
    userId: 'user-1',
    assignedAt: '2024-01-22',
    attempts: [
      {
        id: 'attempt-1',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        startedAt: '2024-01-23T09:15:00Z',
        completedAt: '2024-01-23T09:35:00Z',
        score: 80,
        pointsEarned: 40,
        totalPoints: 50,
        passed: true,
        status: 'completed',
        attemptNumber: 1,
        answers: [
          { questionId: 'q1', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T09:17:00Z' },
          { questionId: 'q2', selectedOptionId: 'b', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T09:20:00Z' },
          { questionId: 'q3', selectedOptionId: 'b', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-23T09:25:00Z' },
          { questionId: 'q4', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T09:30:00Z' },
          { questionId: 'q5', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T09:33:00Z' }
        ]
      }
    ]
  },
  {
    id: 'assign-2',
    testId: 'test-1',
    userId: 'user-2',
    assignedAt: '2024-01-22',
    attempts: [
      {
        id: 'attempt-2',
        userId: 'user-2',
        userName: 'Michael Chen',
        startedAt: '2024-01-23T14:00:00Z',
        completedAt: '2024-01-23T14:25:00Z',
        score: 60,
        pointsEarned: 30,
        totalPoints: 50,
        passed: false,
        status: 'completed',
        attemptNumber: 1,
        answers: [
          { questionId: 'q1', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T14:05:00Z' },
          { questionId: 'q2', selectedOptionId: 'a', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-23T14:10:00Z' },
          { questionId: 'q3', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T14:15:00Z' },
          { questionId: 'q4', selectedOptionId: 'b', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-23T14:20:00Z' },
          { questionId: 'q5', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T14:23:00Z' }
        ]
      },
      {
        id: 'attempt-3',
        userId: 'user-2',
        userName: 'Michael Chen',
        startedAt: '2024-01-24T10:00:00Z',
        completedAt: '2024-01-24T10:28:00Z',
        score: 100,
        pointsEarned: 50,
        totalPoints: 50,
        passed: true,
        status: 'completed',
        attemptNumber: 2,
        answers: [
          { questionId: 'q1', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T10:05:00Z' },
          { questionId: 'q2', selectedOptionId: 'b', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T10:10:00Z' },
          { questionId: 'q3', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T10:15:00Z' },
          { questionId: 'q4', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T10:22:00Z' },
          { questionId: 'q5', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T10:26:00Z' }
        ]
      }
    ]
  },
  {
    id: 'assign-3',
    testId: 'test-1',
    userId: 'user-3',
    assignedAt: '2024-01-22',
    attempts: [
      {
        id: 'attempt-4',
        userId: 'user-3',
        userName: 'Emily Rodriguez',
        startedAt: '2024-01-23T16:30:00Z',
        completedAt: '2024-01-23T16:55:00Z',
        score: 90,
        pointsEarned: 45,
        totalPoints: 50,
        passed: true,
        status: 'completed',
        attemptNumber: 1,
        answers: [
          { questionId: 'q1', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T16:35:00Z' },
          { questionId: 'q2', selectedOptionId: 'b', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T16:40:00Z' },
          { questionId: 'q3', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T16:45:00Z' },
          { questionId: 'q4', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-23T16:50:00Z' },
          { questionId: 'q5', selectedOptionId: 'b', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-23T16:53:00Z' }
        ]
      }
    ]
  },
  {
    id: 'assign-4',
    testId: 'test-1',
    userId: 'user-4',
    assignedAt: '2024-01-22',
    attempts: [
      {
        id: 'attempt-5',
        userId: 'user-4',
        userName: 'David Kim',
        startedAt: '2024-01-24T08:00:00Z',
        completedAt: '2024-01-24T08:22:00Z',
        score: 70,
        pointsEarned: 35,
        totalPoints: 50,
        passed: true,
        status: 'completed',
        attemptNumber: 1,
        answers: [
          { questionId: 'q1', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T08:05:00Z' },
          { questionId: 'q2', selectedOptionId: 'b', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T08:10:00Z' },
          { questionId: 'q3', selectedOptionId: 'b', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-24T08:14:00Z' },
          { questionId: 'q4', selectedOptionId: 'c', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-24T08:18:00Z' },
          { questionId: 'q5', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T08:20:00Z' }
        ]
      }
    ]
  },
  {
    id: 'assign-5',
    testId: 'test-1',
    userId: 'user-5',
    assignedAt: '2024-01-22',
    attempts: [
      {
        id: 'attempt-6',
        userId: 'user-5',
        userName: 'Jessica Taylor',
        startedAt: '2024-01-24T13:00:00Z',
        completedAt: '2024-01-24T13:20:00Z',
        score: 40,
        pointsEarned: 20,
        totalPoints: 50,
        passed: false,
        status: 'completed',
        attemptNumber: 1,
        answers: [
          { questionId: 'q1', selectedOptionId: 'b', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-24T13:05:00Z' },
          { questionId: 'q2', selectedOptionId: 'b', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T13:08:00Z' },
          { questionId: 'q3', selectedOptionId: 'c', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-24T13:12:00Z' },
          { questionId: 'q4', selectedOptionId: 'a', isCorrect: true, pointsEarned: 10, answeredAt: '2024-01-24T13:16:00Z' },
          { questionId: 'q5', selectedOptionId: 'c', isCorrect: false, pointsEarned: 0, answeredAt: '2024-01-24T13:19:00Z' }
        ]
      }
    ]
  },
  {
    id: 'assign-6',
    testId: 'test-1',
    userId: 'user-6',
    assignedAt: '2024-01-22',
    attempts: [
      {
        id: 'attempt-7',
        userId: 'user-6',
        userName: 'Alex Martinez',
        startedAt: '2024-01-25T11:00:00Z',
        completedAt: undefined,
        score: undefined,
        pointsEarned: undefined,
        totalPoints: undefined,
        passed: false,
        status: 'in_progress',
        attemptNumber: 1,
        answers: []
      }
    ]
  }
];

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
      documents: testData.documents.map(file => ({
        name: file.name,
        fileType: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
        uploadedAt: new Date().toISOString()
      })),
      questions: [],
      duration: testData.duration,
      certificateId: testData.certificateId,
      minSuccessPercentage: testData.minSuccessPercentage,
      retryCount: testData.retryCount,
      retryBackoffHours: testData.retryBackoffHours,
      processingJobId: `job-${Date.now()}`
    };
    sampleTests.push(newTest);

    setTimeout(() => {
      const test = sampleTests.find(t => t.id === newTest.id);
      if (test && test.status === 'processing') {
        test.status = 'inactive';
        test.processingJobId = undefined;

        for (let i = 0; i < testData.questionCount; i++) {
          test.questions.push({
            id: `q-${Date.now()}-${i}`,
            question: `Sample generated question ${i + 1}`,
            options: [
              { id: 'a', text: 'Option A' },
              { id: 'b', text: 'Option B' },
              { id: 'c', text: 'Option C' },
              { id: 'd', text: 'Option D' }
            ],
            correctAnswerId: 'a',
            points: 3,
            isManual: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
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
      points: 3,
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
      points: 3,
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

  async getCertificates(): Promise<Certificate[]> {
    await delay(200);
    return [...sampleCertificates];
  },

  async getTestAssignments(userId: string): Promise<TestAssignment[]> {
    await delay(300);
    return sampleTestAssignments.filter(a => a.userId === userId);
  },

  async recordAttempt(assignmentId: string, attempt: TestAttempt): Promise<void> {
    await delay(200);
    const assignment = sampleTestAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.attempts.push(attempt);
    }
  },

  async publishTest(testId: string): Promise<Test> {
    await delay(300);
    const test = sampleTests.find(t => t.id === testId);
    if (!test) {
      throw new Error('Test not found');
    }
    if (test.status !== 'inactive') {
      throw new Error('Only inactive tests can be published');
    }
    if (test.questions.length === 0) {
      throw new Error('Cannot publish test with no questions');
    }

    test.status = 'active';
    test.publishedAt = new Date().toISOString();
    test.updatedAt = new Date().toISOString().split('T')[0];
    return test;
  },

  async unpublishTest(testId: string): Promise<Test> {
    await delay(300);
    const test = sampleTests.find(t => t.id === testId);
    if (!test) {
      throw new Error('Test not found');
    }
    if (test.status !== 'active') {
      throw new Error('Only active tests can be unpublished');
    }

    test.status = 'inactive';
    test.updatedAt = new Date().toISOString().split('T')[0];
    return test;
  },

  async getTestStatistics(testId: string): Promise<TestStatistics> {
    await delay(500);
    const test = sampleTests.find(t => t.id === testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const allAttempts = sampleTestAssignments
      .filter(a => a.testId === testId)
      .flatMap(a => a.attempts);

    const completedAttempts = allAttempts.filter(a => a.status === 'completed');
    const uniqueUsers = new Set(allAttempts.map(a => a.userId)).size;
    const totalAttempts = allAttempts.length;

    const averageScore = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
      : 0;

    const passedAttempts = completedAttempts.filter(a => a.passed).length;
    const passRate = completedAttempts.length > 0
      ? (passedAttempts / completedAttempts.length) * 100
      : 0;

    const attemptSummaries: TestAttemptSummary[] = allAttempts.map(attempt => ({
      attemptId: attempt.id,
      userId: attempt.userId,
      userName: attempt.userName,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      score: attempt.score,
      pointsEarned: attempt.pointsEarned,
      totalPoints: attempt.totalPoints,
      passed: attempt.passed,
      attemptNumber: attempt.attemptNumber,
      answers: attempt.answers
    }));

    return {
      testId: test.id,
      testName: test.name,
      totalAttempts,
      uniqueUsers,
      averageScore: Math.round(averageScore * 10) / 10,
      passRate: Math.round(passRate * 10) / 10,
      attempts: attemptSummaries.sort((a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    };
  }
};
