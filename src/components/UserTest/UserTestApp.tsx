import React, { useState } from 'react';
import { UserTestLogin } from './UserTestLogin';
import { UserTestWelcome } from './UserTestWelcome';
import { UserTestInterface } from './UserTestInterface';
import { UserTestResults } from './UserTestResults';
import { UserTestSession, UserTestResult } from '../../types/userTest';
import { PlannedTest } from '../../types/plannedTest';
import { userTestService } from '../../services/userTestService';

type TestState = 'login' | 'welcome' | 'testing' | 'results';

interface UserTestAppProps {
  onBack?: () => void;
}

export const UserTestApp: React.FC<UserTestAppProps> = ({ onBack }) => {
  const [currentState, setCurrentState] = useState<TestState>('login');
  const [session, setSession] = useState<UserTestSession | null>(null);
  const [plannedTest, setPlannedTest] = useState<PlannedTest | null>(null);
  const [testResult, setTestResult] = useState<UserTestResult | null>(null);

  const handleBackToAdmin = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleLoginSuccess = (newSession: UserTestSession, newPlannedTest: PlannedTest) => {
    setSession(newSession);
    setPlannedTest(newPlannedTest);
    setCurrentState('welcome');
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
    setSession(null);
    setPlannedTest(null);
    setTestResult(null);
    setCurrentState('login');
  };

  switch (currentState) {
    case 'login':
      return <UserTestLogin onLoginSuccess={handleLoginSuccess} onBack={onBack ? handleBackToAdmin : undefined} />;
    
    case 'welcome':
      return session && plannedTest ? (
        <UserTestWelcome
          session={session}
          plannedTest={plannedTest}
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
          onLogout={handleLogout}
        />
      ) : null;
    
    default:
      return null;
  }
};