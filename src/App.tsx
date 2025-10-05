import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { RightMenu } from './components/Navigation/RightMenu';
import { JobProgressModal } from './components/Jobs/JobProgressModal';
import { TestsList } from './components/Tests/TestsList';
import { TestEditor } from './components/Tests/TestEditor';
import { UserTestApp } from './components/UserTest/UserTestApp';

type AppView = 'list' | 'editor';
type AppPage = 'tests';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentPage] = useState<AppPage>('tests');
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [showUserTest, setShowUserTest] = useState(false);

  const handleTakeTest = () => {
    setShowUserTest(true);
  };

  const handleBackToAdmin = () => {
    setShowUserTest(false);
  };

  // If showing user test, render only that
  if (showUserTest) {
    return <UserTestApp onBack={handleBackToAdmin} />;
  }

  const handleTestSelect = (testId: string) => {
    setSelectedTestId(testId);
    setCurrentView('editor');
  };

  const handleBackToTests = () => {
    setCurrentView('list');
    setSelectedTestId(null);
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handlePageChange = () => {
    setIsMenuExpanded(false);
  };

  const renderCurrentPage = () => {
    return currentView === 'list' ? (
      <TestsList
        onTestSelect={handleTestSelect}
        onJobSelect={handleJobSelect}
      />
    ) : (
      selectedTestId && (
        <TestEditor testId={selectedTestId} onBack={handleBackToTests} />
      )
    );
  };
  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        onMenuToggle={() => setIsMenuExpanded(!isMenuExpanded)}
        onTakeTest={handleTakeTest}
      />
      {renderCurrentPage()}
      <RightMenu 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        isExpanded={isMenuExpanded}
        onToggle={() => setIsMenuExpanded(!isMenuExpanded)}
      />
      
      {/* Job Progress Modal */}
      {selectedJobId && (
        <JobProgressModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}

export default App;