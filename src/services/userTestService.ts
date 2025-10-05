import { UserTestSession, UserTestLogin, UserTestQuestion, UserTestResult, UserAnswer } from '../types/userTest';
import { PlannedTest } from '../types/plannedTest';
import { plannedTestService } from './plannedTestService';

// Mock test questions for demonstration
const mockTestQuestions: UserTestQuestion[] = [
  {
    id: 'q1',
    question: 'What is React primarily used for?',
    options: [
      { id: 'a', text: 'Building user interfaces' },
      { id: 'b', text: 'Database management' },
      { id: 'c', text: 'Server-side scripting' },
      { id: 'd', text: 'Mobile app development only' }
    ]
  },
  {
    id: 'q2',
    question: 'Which syntax does React use to describe UI elements?',
    options: [
      { id: 'a', text: 'HTML' },
      { id: 'b', text: 'JSX' },
      { id: 'c', text: 'XML' },
      { id: 'd', text: 'JSON' }
    ]
  },
  {
    id: 'q3',
    question: 'What are React hooks used for?',
    options: [
      { id: 'a', text: 'State management in functional components' },
      { id: 'b', text: 'Styling components' },
      { id: 'c', text: 'Database connections' },
      { id: 'd', text: 'File uploads' }
    ]
  },
  {
    id: 'q4',
    question: 'Which method is used to render a React component?',
    options: [
      { id: 'a', text: 'render()' },
      { id: 'b', text: 'display()' },
      { id: 'c', text: 'show()' },
      { id: 'd', text: 'mount()' }
    ]
  },
  {
    id: 'q5',
    question: 'What is the virtual DOM in React?',
    options: [
      { id: 'a', text: 'A lightweight copy of the real DOM' },
      { id: 'b', text: 'A database for storing component data' },
      { id: 'c', text: 'A CSS framework' },
      { id: 'd', text: 'A testing library' }
    ]
  }
];

// Correct answers for scoring
const correctAnswers: Record<string, string> = {
  'q1': 'a',
  'q2': 'b',
  'q3': 'a',
  'q4': 'a',
  'q5': 'a'
};

// Mock active sessions
let activeSessions: UserTestSession[] = [];

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userTestService = {
  async loginToTest(loginData: UserTestLogin): Promise<{ session: UserTestSession; plannedTest: PlannedTest }> {
    await delay(800);
    
    // Find planned test by code
    const allPlannedTests = await plannedTestService.getAllPlannedTests();
    const plannedTest = allPlannedTests.find(test => test.code === loginData.testCode.toUpperCase());
    
    if (!plannedTest) {
      throw new Error('Test code not found. Please check your test code and try again.');
    }

    // Check if test is in progress
    if (plannedTest.status !== 'in_progress') {
      if (plannedTest.status === 'planned') {
        throw new Error('This test has not started yet. Please wait for the scheduled start time.');
      } else {
        throw new Error('This test has already ended. Please contact your administrator.');
      }
    }

    // Check attendee slots (mock logic)
    const currentAttendees = activeSessions.filter(s => s.plannedTestId === plannedTest.id).length;
    if (currentAttendees >= plannedTest.attendees) {
      throw new Error('This test session is full. No more attendee slots available.');
    }

    // Create new session
    const session: UserTestSession = {
      id: `session-${Date.now()}`,
      plannedTestId: plannedTest.id,
      testCode: plannedTest.code,
      testName: plannedTest.testName,
      attendeeName: `${loginData.firstName} ${loginData.lastName}`,
      attendeeEmail: `${loginData.firstName.toLowerCase()}.${loginData.lastName.toLowerCase()}@company.com`,
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      answers: [],
      status: 'in_progress',
      timeRemaining: plannedTest.timeWindow * 60, // Convert minutes to seconds
      totalQuestions: mockTestQuestions.length
    };

    activeSessions.push(session);
    return { session, plannedTest };
  },

  async getTestQuestions(): Promise<UserTestQuestion[]> {
    await delay(300);
    return [...mockTestQuestions];
  },

  async submitAnswer(sessionId: string, questionId: string, selectedOptionId: string): Promise<UserTestSession> {
    await delay(200);
    
    const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }

    const session = activeSessions[sessionIndex];
    
    // Add or update answer
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

    // Move to next question if not already there
    const currentQuestionId = mockTestQuestions[session.currentQuestionIndex]?.id;
    if (currentQuestionId === questionId && session.currentQuestionIndex < mockTestQuestions.length - 1) {
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

    // Calculate score
    let correctCount = 0;
    session.answers.forEach(answer => {
      if (correctAnswers[answer.questionId] === answer.selectedOptionId) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / mockTestQuestions.length) * 100);
    const startTime = new Date(session.startedAt);
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${durationMinutes}m ${durationSeconds}s`;

    const result: UserTestResult = {
      score,
      totalQuestions: mockTestQuestions.length,
      correctAnswers: correctCount,
      completedAt: endTime.toISOString(),
      duration
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