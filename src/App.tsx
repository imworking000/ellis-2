import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { DocumentList } from './components/DocumentList/DocumentList';
import { DocumentEditor } from './components/DocumentEditor/DocumentEditor';
import { LabelsList } from './components/Labels/LabelsList';
import { RightMenu } from './components/Navigation/RightMenu';
import { JobsList } from './components/Jobs/JobsList';
import { TestsList } from './components/Tests/TestsList';
import { TestEditor } from './components/Tests/TestEditor';
import { TestHistory } from './components/Tests/TestHistory';
import { PlannedTestsList } from './components/PlannedTests/PlannedTestsList';
import { PlannedTestDetails } from './components/PlannedTests/PlannedTestDetails';
import { UserTestApp } from './components/UserTest/UserTestApp';

type AppView = 'list' | 'editor' | 'history';
type AppPage = 'documents' | 'labels' | 'jobs' | 'tests' | 'planned-tests' | 'analytics' | 'users' | 'settings' | 'help';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedPlannedTestId, setSelectedPlannedTestId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('documents');
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [showUserTest, setShowUserTest] = useState(false);

  // Check if we should show the user test interface
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/test') {
      setShowUserTest(true);
    }
  }, []);

  // If showing user test, render only that
  if (showUserTest) {
    return <UserTestApp />;
  }

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setCurrentView('editor');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedDocumentId(null);
  };

  const handleTestSelect = (testId: string) => {
    setSelectedTestId(testId);
    setCurrentView('editor');
  };

  const handleBackToTests = () => {
    setCurrentView('list');
    setSelectedTestId(null);
  };

  const handlePlannedTestSelect = (testId: string) => {
    setSelectedPlannedTestId(testId);
    setCurrentView('editor');
  };

  const handleBackToPlannedTests = () => {
    setCurrentView('list');
    setSelectedPlannedTestId(null);
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as AppPage);
    setIsMenuExpanded(false);
    // For now, only documents page is implemented
    if (page !== 'documents') {
      // Future: Navigate to other pages
      console.log(`Navigating to ${page} page (not implemented yet)`);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'documents':
        return currentView === 'list' ? (
          <DocumentList 
            onDocumentSelect={handleDocumentSelect}
            onJobSelect={handleJobSelect}
          />
        ) : (
          selectedDocumentId && (
            <DocumentEditor
              documentId={selectedDocumentId}
              onBack={handleBackToList}
            />
          )
        );
      case 'labels':
        return <LabelsList />;
      case 'jobs':
        return <JobsList />;
      case 'tests':
        if (currentView === 'history') {
          return <TestHistory onBack={() => setCurrentView('list')} />;
        }
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
      case 'planned-tests':
        return currentView === 'list' ? (
          <PlannedTestsList onTestSelect={handlePlannedTestSelect} />
        ) : (
          selectedPlannedTestId && (
            <PlannedTestDetails testId={selectedPlannedTestId} onBack={handleBackToPlannedTests} />
          )
        );
      default:
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-2">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
              </h2>
              <p className="text-[#5D5D5D]">This page will be implemented soon.</p>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentPage={currentPage} 
        onMenuToggle={() => setIsMenuExpanded(!isMenuExpanded)}
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