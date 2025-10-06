import { UserTestSession, UserTestLogin, UserTestQuestion, UserTestResult, UserAnswer, User, UserTestAssignment } from '../types/userTest';
import { testService } from './testService';

const mockTestQuestions: Record<string, UserTestQuestion[]> = {
  'test-1': [
    {
      id: 'q1',
      question: 'What is React primarily used for?',
      options: [
        { id: 'a', text: 'Building user interfaces' },
        { id: 'b', text: 'Database management' },
        { id: 'c', text: 'Server-side scripting' },
        { id: 'd', text: 'Mobile app development only' }
      ],
      points: 3
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
      points: 3
    }
  ],
  'test-2': [
    {
      id: 'q3',
      question: 'What are TypeScript generics used for?',
      options: [
        { id: 'a', text: 'Type safety with reusable components' },
        { id: 'b', text: 'Runtime performance optimization' },
        { id: 'c', text: 'Database connections' },
        { id: 'd', text: 'CSS styling' }
      ],
      points: 4
    },
    {
      id: 'q4',
      question: 'What is the purpose of TypeScript interfaces?',
      options: [
        { id: 'a', text: 'Define the shape of objects' },
        { id: 'b', text: 'Improve runtime speed' },
        { id: 'c', text: 'Handle async operations' },
        { id: 'd', text: 'Manage state' }
      ],
      points: 4
    },
    {
      id: 'q5',
      question: 'What does the "readonly" modifier do?',
      options: [
        { id: 'a', text: 'Prevents property modification after initialization' },
        { id: 'b', text: 'Makes properties private' },
        { id: 'c', text: 'Adds type checking' },
        { id: 'd', text: 'Optimizes compilation' }
      ],
      points: 4
    }
  ]
};

const correctAnswers: Record<string, string> = {
  'q1': 'a',
  'q2': 'b',
  'q3': 'a',
  'q4': 'a',
  'q5': 'a'
};

const sampleUsers: User[] = [
  { id: 'user-1', username: 'sjohnson', password: 'pass123', name: 'Sarah Johnson', email: 'sjohnson@example.com' },
  { id: 'user-2', username: 'mchen', password: 'pass123', name: 'Michael Chen', email: 'mchen@example.com' },
  { id: 'user-3', username: 'erodriguez', password: 'pass123', name: 'Emily Rodriguez', email: 'erodriguez@example.com' }
];

let activeSessions: UserTestSession[] = [];

const userTestAttempts: Record<string, Array<{ testId: string; completedAt: string; passed: boolean; }>> = {
  'user-1': [
    { testId: 'test-1', completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), passed: false }
  ]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userTestService = {
  async login(loginData: UserTestLogin): Promise<{ user: User; assignments: UserTestAssignment[] }> {
    await delay(800);

    const user = sampleUsers.find(u => u.username === loginData.username && u.password === loginData.password);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const assignments = await this.getUserTestAssignments(user.id);

    return { user, assignments };
  },

  async getUserTestAssignments(userId: string): Promise<UserTestAssignment[]> {
    await delay(500);

    const assignments = await testService.getTestAssignments(userId);
    const tests = await testService.getAllTests();
    const userAttempts = userTestAttempts[userId] || [];

    return assignments.map(assignment => {
      const test = tests.find(t => t.id === assignment.testId);
      if (!test) return null;

      const testAttempts = userAttempts.filter(a => a.testId === test.id);
      const lastAttempt = testAttempts[testAttempts.length - 1];

      let canRetry = false;
      let nextRetryAt: string | undefined;

      if (lastAttempt && !lastAttempt.passed) {
        const attemptTime = new Date(lastAttempt.completedAt).getTime();
        const backoffMs = test.retryBackoffHours * 60 * 60 * 1000;
        const nextRetryTime = attemptTime + backoffMs;
        canRetry = Date.now() >= nextRetryTime && testAttempts.length < test.retryCount;
        nextRetryAt = new Date(nextRetryTime).toISOString();
      }

      const canTakeNow = !lastAttempt || lastAttempt.passed || canRetry;
      let retryMessage: string | undefined;

      if (lastAttempt && !lastAttempt.passed && !canRetry && nextRetryAt) {
        const retryDate = new Date(nextRetryAt);
        const now = new Date();
        const hoursLeft = Math.ceil((retryDate.getTime() - now.getTime()) / (1000 * 60 * 60));

        if (hoursLeft > 0) {
          retryMessage = `You can retry this test in ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}. Next attempt available: ${retryDate.toLocaleString()}`;
        }
      } else if (testAttempts.length >= test.retryCount && lastAttempt && !lastAttempt.passed) {
        retryMessage = 'You have used all available attempts for this test.';
      }

      return {
        testId: test.id,
        testName: test.name,
        description: test.description,
        status: test.status as 'active' | 'inactive',
        duration: test.duration,
        questionCount: test.questions.length,
        lastAttempt: lastAttempt ? {
          completedAt: lastAttempt.completedAt,
          passed: lastAttempt.passed,
          score: 60,
          canRetry,
          nextRetryAt: !canRetry && nextRetryAt ? nextRetryAt : undefined
        } : undefined,
        attemptsUsed: testAttempts.length,
        maxAttempts: test.retryCount,
        canTakeNow,
        retryMessage
      };
    }).filter((a): a is UserTestAssignment => a !== null);
  },

  async startTest(userId: string, testId: string): Promise<UserTestSession> {
    await delay(800);

    const test = await testService.getTest(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    if (test.status !== 'active') {
      throw new Error('This test is not currently active');
    }

    const user = sampleUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userAttempts = userTestAttempts[userId] || [];
    const testAttempts = userAttempts.filter(a => a.testId === testId);
    const lastAttempt = testAttempts[testAttempts.length - 1];

    if (lastAttempt && !lastAttempt.passed) {
      const attemptTime = new Date(lastAttempt.completedAt).getTime();
      const backoffMs = test.retryBackoffHours * 60 * 60 * 1000;
      const nextRetryTime = attemptTime + backoffMs;

      if (Date.now() < nextRetryTime) {
        throw new Error(`You must wait until ${new Date(nextRetryTime).toLocaleString()} before retrying this test`);
      }

      if (testAttempts.length >= test.retryCount) {
        throw new Error('You have used all available retry attempts for this test');
      }
    }

    const session: UserTestSession = {
      id: `session-${Date.now()}`,
      testId: test.id,
      userId: user.id,
      testName: test.name,
      userName: user.name,
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      answers: [],
      status: 'in_progress',
      timeRemaining: test.duration * 60,
      totalQuestions: mockTestQuestions[testId]?.length || 0,
      attemptNumber: testAttempts.length + 1
    };

    activeSessions.push(session);
    return session;
  },

  async getTestQuestions(testId: string): Promise<UserTestQuestion[]> {
    await delay(300);
    const questions = mockTestQuestions[testId] || [];
    if (questions.length === 0) {
      console.warn(`No questions found for testId: ${testId}`);
    }
    return [...questions];
  },

  async submitAnswer(sessionId: string, questionId: string, selectedOptionId: string): Promise<UserTestSession> {
    await delay(200);

    const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }

    const session = activeSessions[sessionIndex];
    const questions = mockTestQuestions[session.testId] || [];

    const existingAnswerIndex = session.answers.findIndex(a => a.questionId === questionId);
    const answer: UserAnswer = {
      questionId,
      selectedOptionId,
      answeredAt: new Date().toISOString()
    };

    if (existingAnswerIndex >= 0) {
      session.answers[existingAnswerIndex] = answer;
    } else {
      session.answers.push(answer);
    }

    const currentQuestionId = questions[session.currentQuestionIndex]?.id;
    if (currentQuestionId === questionId && session.currentQuestionIndex < questions.length - 1) {
      session.currentQuestionIndex++;
    }

    activeSessions[sessionIndex] = session;
    return session;
  },

  async completeTest(sessionId: string): Promise<UserTestResult> {
    await delay(500);

    const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }

    const session = activeSessions[sessionIndex];
    session.status = 'completed';

    const test = await testService.getTest(session.testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const questions = mockTestQuestions[session.testId] || [];
    let pointsEarned = 0;
    let totalPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      const answer = session.answers.find(a => a.questionId === question.id);
      if (answer && correctAnswers[question.id] === answer.selectedOptionId) {
        pointsEarned += question.points;
      }
    });

    const score = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
    const passed = score >= test.minSuccessPercentage;

    const startTime = new Date(session.startedAt);
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${durationMinutes}m ${durationSeconds}s`;

    if (!userTestAttempts[session.userId]) {
      userTestAttempts[session.userId] = [];
    }
    userTestAttempts[session.userId].push({
      testId: session.testId,
      completedAt: endTime.toISOString(),
      passed
    });

    const correctAnswers = questions.filter(question => {
      const answer = session.answers.find(a => a.questionId === question.id);
      return answer && correctAnswers[question.id] === answer.selectedOptionId;
    }).length;

    const result: UserTestResult = {
      score,
      pointsEarned,
      totalPoints,
      correctAnswers,
      totalQuestions: questions.length,
      passed,
      completedAt: endTime.toISOString(),
      duration,
      certificateId: passed ? test.certificateId : undefined
    };

    activeSessions[sessionIndex] = session;
    return result;
  },

  async getSession(sessionId: string): Promise<UserTestSession | null> {
    await delay(100);
    return activeSessions.find(s => s.id === sessionId) || null;
  },

  async updateTimeRemaining(sessionId: string, timeRemaining: number): Promise<void> {
    const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex >= 0) {
      activeSessions[sessionIndex].timeRemaining = timeRemaining;
    }
  }
};
