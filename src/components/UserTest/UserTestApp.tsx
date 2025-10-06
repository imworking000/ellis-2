import React, { useState } from 'react';
import { UserTestLogin } from './UserTestLogin';
import { UserTestSelection } from './UserTestSelection';
import { UserTestWelcome } from './UserTestWelcome';
import { UserTestInterface } from './UserTestInterface';
import { UserTestResults } from './UserTestResults';
import { UserTestSession, UserTestResult, User, UserTestAssignment } from '../../types/userTest';
import { userTestService } from '../../services/userTestService';

type TestState = 'login' | 'selection' | 'welcome' | 'testing' | 'results';

interface UserTestAppProps {
  onBack?: () => void;
}

export const UserTestApp: React.FC<UserTestAppProps> = ({ onBack }) => {
  const [currentState, setCurrentState] = useState<TestState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<UserTestAssignment[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [session, setSession] = useState<UserTestSession | null>(null);
  const [testResult, setTestResult] = useState<UserTestResult | null>(null);

  const handleBackToAdmin = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleLoginSuccess = async (loggedInUser: User, userAssignments: UserTestAssignment[]) => {
    setUser(loggedInUser);
    setAssignments(userAssignments);

    const activeAssignments = userAssignments.filter(a => a.status === 'active');
    const takableAssignments = activeAssignments.filter(a => a.canTakeNow);

    if (takableAssignments.length === 1 && (!takableAssignments[0].lastAttempt || !takableAssignments[0].lastAttempt.passed)) {
      await handleSelectTest(takableAssignments[0].testId);
    } else {
      setCurrentState('selection');
    }
  };

  const handleSelectTest = async (testId: string) => {
    if (!user) return;

    try {
      setSelectedTestId(testId);
      const newSession = await userTestService.startTest(user.id, testId);
      setSession(newSession);
      setCurrentState('welcome');
    } catch (error) {
      console.error('Failed to start test:', error);
      alert(error instanceof Error ? error.message : 'Failed to start test');
    }
  };

  const handleStartTest = () => {
    setCurrentState('testing');
  };

  const handleTestComplete = async () => {
    if (!session) return;

    try {
      const result = await userTestService.completeTest(session.id);
      setTestResult(result);
      setCurrentState('results');
    } catch (error) {
      console.error('Failed to complete test:', error);
    }
  };

  const handleTimeUp = async () => {
    if (!session) return;

    try {
      const result = await userTestService.completeTest(session.id);
      setTestResult(result);
      setCurrentState('results');
    } catch (error) {
      console.error('Failed to complete test:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAssignments([]);
    setSelectedTestId(null);
    setSession(null);
    setTestResult(null);
    setCurrentState('login');
  };

  const handleBackToSelection = () => {
    setSelectedTestId(null);
    setSession(null);
    setTestResult(null);
    setCurrentState('selection');
  };

  switch (currentState) {
    case 'login':
      return <UserTestLogin onLoginSuccess={handleLoginSuccess} onBack={onBack ? handleBackToAdmin : undefined} />;

    case 'selection':
      return user ? (
        <UserTestSelection
          user={user}
          assignments={assignments}
          onSelectTest={handleSelectTest}
          onLogout={handleLogout}
        />
      ) : null;

    case 'welcome':
      return session ? (
        <UserTestWelcome
          session={session}
          onStartTest={handleStartTest}
        />
      ) : null;

    case 'testing':
      return session ? (
        <UserTestInterface
          session={session}
          onTestComplete={handleTestComplete}
          onTimeUp={handleTimeUp}
        />
      ) : null;

    case 'results':
      return testResult && session ? (
        <UserTestResults
          result={testResult}
          testName={session.testName}
          onLogout={handleBackToSelection}
        />
      ) : null;

    default:
      return null;
  }
};
