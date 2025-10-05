import { PlannedTest, TestResult, PlannedTestFormData } from '../types/plannedTest';

// Dummy data for development
const samplePlannedTests: PlannedTest[] = [
  {
    id: 'planned-1',
    testId: 'test-1',
    testName: 'React Fundamentals Assessment',
    slug: 'react-fundamentals-jan-2024',
    code: 'REACT-2024-001',
    scheduledDate: '2024-02-15',
    startTime: '10:00',
    endTime: '11:00',
    timeWindow: 60,
    attendees: 25,
    responsibleManager: 'Sarah Johnson',
    status: 'planned',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    description: 'Monthly React assessment for frontend team'
  },
  {
    id: 'planned-2',
    testId: 'test-2',
    testName: 'TypeScript Advanced Patterns',
    slug: 'typescript-advanced-feb-2024',
    code: 'TS-ADV-2024-002',
    scheduledDate: '2024-01-26',
    startTime: '14:00',
    endTime: '15:30',
    timeWindow: 90,
    attendees: 15,
    responsibleManager: 'Mike Chen',
    status: 'in_progress', // This one is available for testing
    createdAt: '2024-01-20',
    updatedAt: '2024-01-26',
    description: 'Advanced TypeScript concepts evaluation'
  },
  {
    id: 'planned-3',
    testId: 'test-1',
    testName: 'React Fundamentals Assessment',
    slug: 'react-fundamentals-dec-2023',
    code: 'REACT-2023-012',
    scheduledDate: '2023-12-20',
    startTime: '09:00',
    endTime: '10:00',
    timeWindow: 60,
    attendees: 20,
    responsibleManager: 'Sarah Johnson',
    status: 'finished',
    createdAt: '2023-12-15',
    updatedAt: '2023-12-20',
    description: 'End of year React assessment',
    results: [
      {
        id: 'result-1',
        attendeeId: 'user-1',
        attendeeName: 'John Smith',
        attendeeEmail: 'john.smith@company.com',
        startedAt: '2023-12-20T09:05:00Z',
        completedAt: '2023-12-20T09:45:00Z',
        score: 85,
        status: 'completed',
        answers: [
          {
            questionId: 'q1',
            questionText: 'What is React primarily used for?',
            selectedOption: { id: 'a', text: 'Building user interfaces' },
            correctOption: { id: 'a', text: 'Building user interfaces' },
            allOptions: [
              { id: 'a', text: 'Building user interfaces' },
              { id: 'b', text: 'Database management' },
              { id: 'c', text: 'Server-side scripting' },
              { id: 'd', text: 'Mobile app development only' }
            ],
            selectedOptionId: 'a',
            isCorrect: true,
            answeredAt: '2023-12-20T09:10:00Z'
          },
          {
            questionId: 'q2',
            questionText: 'Which syntax does React use to describe UI elements?',
            selectedOption: { id: 'b', text: 'JSX' },
            correctOption: { id: 'b', text: 'JSX' },
            allOptions: [
              { id: 'a', text: 'HTML' },
              { id: 'b', text: 'JSX' },
              { id: 'c', text: 'XML' },
              { id: 'd', text: 'JSON' }
            ],
            selectedOptionId: 'b',
            isCorrect: true,
            answeredAt: '2023-12-20T09:15:00Z'
          }
        ]
      },
      {
        id: 'result-2',
        attendeeId: 'user-2',
        attendeeName: 'Emma Wilson',
        attendeeEmail: 'emma.wilson@company.com',
        startedAt: '2023-12-20T09:02:00Z',
        completedAt: '2023-12-20T09:38:00Z',
        score: 92,
        status: 'completed',
        answers: [
          {
            questionId: 'q1',
            questionText: 'What is React primarily used for?',
            selectedOption: { id: 'a', text: 'Building user interfaces' },
            correctOption: { id: 'a', text: 'Building user interfaces' },
            allOptions: [
              { id: 'a', text: 'Building user interfaces' },
              { id: 'b', text: 'Database management' },
              { id: 'c', text: 'Server-side scripting' },
              { id: 'd', text: 'Mobile app development only' }
            ],
            selectedOptionId: 'a',
            isCorrect: true,
            answeredAt: '2023-12-20T09:08:00Z'
          },
          {
            questionId: 'q2',
            questionText: 'Which syntax does React use to describe UI elements?',
            selectedOption: { id: 'b', text: 'JSX' },
            correctOption: { id: 'b', text: 'JSX' },
            allOptions: [
              { id: 'a', text: 'HTML' },
              { id: 'b', text: 'JSX' },
              { id: 'c', text: 'XML' },
              { id: 'd', text: 'JSON' }
            ],
            selectedOptionId: 'b',
            isCorrect: true,
            answeredAt: '2023-12-20T09:12:00Z'
          }
        ]
      },
      {
        id: 'result-3',
        attendeeId: 'user-3',
        attendeeName: 'David Brown',
        attendeeEmail: 'david.brown@company.com',
        startedAt: '2023-12-20T09:10:00Z',
        status: 'abandoned',
        answers: [
          {
            questionId: 'q1',
            questionText: 'What is React primarily used for?',
            selectedOption: { id: 'a', text: 'Building user interfaces' },
            correctOption: { id: 'a', text: 'Building user interfaces' },
            allOptions: [
              { id: 'a', text: 'Building user interfaces' },
              { id: 'b', text: 'Database management' },
              { id: 'c', text: 'Server-side scripting' },
              { id: 'd', text: 'Mobile app development only' }
            ],
            selectedOptionId: 'a',
            isCorrect: true,
            answeredAt: '2023-12-20T09:15:00Z'
          }
        ]
      }
    ]
  }
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const plannedTestService = {
  async getAllPlannedTests(): Promise<PlannedTest[]> {
    await delay(300);
    return [...samplePlannedTests].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  },

  async getPlannedTest(id: string): Promise<PlannedTest | null> {
    await delay(200);
    return samplePlannedTests.find(test => test.id === id) || null;
  },

  async createPlannedTest(testData: PlannedTestFormData): Promise<PlannedTest> {
    await delay(500);
    const endTime = this.calculateEndTime(testData.startTime, testData.timeWindow);
    const slug = this.generateSlug(testData.testId, testData.scheduledDate);
    
    const newPlannedTest: PlannedTest = {
      id: `planned-${Date.now()}`,
      testId: testData.testId,
      testName: 'Test Name', // Would be fetched from test service
      slug,
      code: testData.code,
      scheduledDate: testData.scheduledDate,
      startTime: testData.startTime,
      endTime,
      timeWindow: testData.timeWindow,
      attendees: testData.attendees,
      responsibleManager: testData.responsibleManager,
      status: 'planned',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      description: testData.description
    };
    
    samplePlannedTests.push(newPlannedTest);
    return newPlannedTest;
  },

  async updatePlannedTest(id: string, testData: Partial<PlannedTestFormData>): Promise<PlannedTest> {
    await delay(400);
    const testIndex = samplePlannedTests.findIndex(test => test.id === id);
    if (testIndex === -1) {
      throw new Error('Planned test not found');
    }
    
    const currentTest = samplePlannedTests[testIndex];
    const updatedTest = {
      ...currentTest,
      ...testData,
      endTime: testData.startTime && testData.timeWindow 
        ? this.calculateEndTime(testData.startTime, testData.timeWindow)
        : currentTest.endTime,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    samplePlannedTests[testIndex] = updatedTest;
    return updatedTest;
  },

  async deletePlannedTest(id: string): Promise<void> {
    await delay(300);
    const testIndex = samplePlannedTests.findIndex(test => test.id === id);
    if (testIndex === -1) {
      throw new Error('Planned test not found');
    }
    samplePlannedTests.splice(testIndex, 1);
  },

  calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  },

  generateSlug(testId: string, date: string): string {
    const dateStr = new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }).toLowerCase().replace(' ', '-');
    return `test-${testId}-${dateStr}`;
  },

  getTestStatus(scheduledDate: string, startTime: string, endTime: string): PlannedTest['status'] {
    const now = new Date();
    const testDate = new Date(scheduledDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const testStart = new Date(testDate);
    testStart.setHours(startHours, startMinutes, 0, 0);
    
    const testEnd = new Date(testDate);
    testEnd.setHours(endHours, endMinutes, 0, 0);
    
    if (now < testStart) return 'planned';
    if (now >= testStart && now <= testEnd) return 'in_progress';
    return 'finished';
  }
};