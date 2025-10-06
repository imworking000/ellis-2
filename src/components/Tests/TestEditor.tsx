import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, RefreshCw, Trash2, CreditCard as Edit3, CheckCircle, X, Lock, Unlock, BarChart3 } from 'lucide-react';
import { Test, TestQuestion } from '../../types/test';
import { testService } from '../../services/testService';
import { QuestionEditor } from './QuestionEditor';
import { TestStatistics } from './TestStatistics';

interface TestEditorProps {
  testId: string;
  onBack: () => void;
}

export const TestEditor: React.FC<TestEditorProps> = ({ testId, onBack }) => {
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [regeneratingNew, setRegeneratingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<TestQuestion | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    duration: 0,
    minSuccessPercentage: 0,
    retryCount: 0,
    retryBackoffHours: 0
  });

  useEffect(() => {
    loadTest();
  }, [testId]);

  useEffect(() => {
    if (test) {
      setSettingsForm({
        duration: test.duration,
        minSuccessPercentage: test.minSuccessPercentage,
        retryCount: test.retryCount,
        retryBackoffHours: test.retryBackoffHours
      });
    }
  }, [test]);

  const loadTest = async () => {
    try {
      const testData = await testService.getTest(testId);
      setTest(testData);
    } catch (error) {
      console.error('Failed to load test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualQuestion = async () => {
    if (!test) return;
    
    try {
      const newQuestion = await testService.addManualQuestion(test.id);
      // Reload the test to get the updated questions from the service
      await loadTest();
      setEditingQuestionId(newQuestion.id);
    } catch (error) {
      console.error('Failed to add manual question:', error);
    }
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    setRegeneratingId(questionId);
    try {
      const updatedQuestion = await testService.regenerateQuestion(testId, questionId);
      setTest(prev => prev ? {
        ...prev,
        questions: prev.questions.map(q => q.id === questionId ? updatedQuestion : q)
      } : null);
    } catch (error) {
      console.error('Failed to regenerate question:', error);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleRegenerateNewQuestion = async () => {
    if (!test) return;

    setRegeneratingNew(true);
    try {
      const newQuestion = await testService.generateNewQuestion(test.id);
      await loadTest();
    } catch (error) {
      console.error('Failed to generate new question:', error);
      alert('Failed to generate new question');
    } finally {
      setRegeneratingNew(false);
    }
  };

  const handleDeleteClick = (question: TestQuestion) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    
    setDeletingId(questionToDelete.id);
    try {
      await testService.deleteQuestion(testId, questionToDelete.id);
      setTest(prev => prev ? {
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionToDelete.id)
      } : null);
    } catch (error) {
      console.error('Failed to delete question:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const handleQuestionUpdate = (updatedQuestion: TestQuestion) => {
    setTest(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    } : null);
    setEditingQuestionId(null);
  };

  const isActive = test?.status === 'active';
  const isInactive = test?.status === 'inactive';
  const canEdit = isInactive;

  const handlePublish = async () => {
    if (!test) return;
    setPublishing(true);
    try {
      const updatedTest = await testService.publishTest(test.id);
      setTest(updatedTest);
    } catch (error) {
      console.error('Failed to publish test:', error);
      alert(error instanceof Error ? error.message : 'Failed to publish test');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!test) return;
    if (!confirm('Are you sure you want to unpublish this test? Users will no longer be able to take it.')) return;
    setPublishing(true);
    try {
      const updatedTest = await testService.unpublishTest(test.id);
      setTest(updatedTest);
    } catch (error) {
      console.error('Failed to unpublish test:', error);
      alert(error instanceof Error ? error.message : 'Failed to unpublish test');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!test) return;
    try {
      const updatedTest = await testService.updateTest(test.id, {
        duration: settingsForm.duration,
        minSuccessPercentage: settingsForm.minSuccessPercentage,
        retryCount: settingsForm.retryCount,
        retryBackoffHours: settingsForm.retryBackoffHours
      });
      setTest(updatedTest);
      setEditingSettings(false);
    } catch (error) {
      console.error('Failed to update test settings:', error);
      alert('Failed to update test settings');
    }
  };

  const handleCancelSettings = () => {
    if (test) {
      setSettingsForm({
        duration: test.duration,
        minSuccessPercentage: test.minSuccessPercentage,
        retryCount: test.retryCount,
        retryBackoffHours: test.retryBackoffHours
      });
    }
    setEditingSettings(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-black mb-2">Test not found</h2>
          <button
            onClick={onBack}
            className="text-[#F8AF00] hover:text-[#E69F00] transition-colors"
          >
            Return to tests list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#5D5D5D] hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Tests
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-black">{test.name}</h1>
                {isActive && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Lock className="w-3 h-3" />
                    Published
                  </div>
                )}
                {isInactive && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    <Unlock className="w-3 h-3" />
                    Draft
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-[#5D5D5D]">
                  {test.questions.length} questions
                </span>
                {test.publishedAt && (
                  <span className="text-sm text-[#5D5D5D]">
                    Published: {new Date(test.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isActive && (
              <>
                <button
                  onClick={() => setShowStatistics(!showStatistics)}
                  className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  {showStatistics ? 'Hide' : 'View'} Statistics
                </button>
                <button
                  onClick={handleUnpublish}
                  disabled={publishing}
                  className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <Unlock className="w-4 h-4" />
                  {publishing ? 'Unpublishing...' : 'Unpublish Test'}
                </button>
              </>
            )}
            {isInactive && (
              <>
                <button
                  onClick={handleAddManualQuestion}
                  className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question Manually
                </button>
                <button
                  onClick={handleRegenerateNewQuestion}
                  disabled={regeneratingNew}
                  className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${regeneratingNew ? 'animate-spin' : ''}`} />
                  {regeneratingNew ? 'Generating...' : 'Generate New Question'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing || test.questions.length === 0}
                  className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Lock className="w-4 h-4" />
                  {publishing ? 'Publishing...' : 'Publish Test'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Read-only warning for published tests */}
      {isActive && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">
                This test is published and in read-only mode
              </p>
              <p className="text-blue-700 text-sm">
                Unpublish the test to make changes to questions or settings
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Settings */}
      <div className="max-w-7xl mx-auto p-6 border-b border-gray-200">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Test Settings</h2>
            {canEdit && !editingSettings && (
              <button
                onClick={() => setEditingSettings(true)}
                className="flex items-center gap-2 text-[#5D5D5D] hover:text-[#F8AF00] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Settings
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Test Duration (minutes)
              </label>
              {editingSettings ? (
                <input
                  type="number"
                  min="1"
                  value={settingsForm.duration}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent"
                />
              ) : (
                <p className="text-[#5D5D5D]">{test.duration} minutes</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Minimum Passing Score (%)
              </label>
              {editingSettings ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settingsForm.minSuccessPercentage}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, minSuccessPercentage: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent"
                />
              ) : (
                <p className="text-[#5D5D5D]">{test.minSuccessPercentage}%</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Maximum Retry Attempts
              </label>
              {editingSettings ? (
                <input
                  type="number"
                  min="0"
                  value={settingsForm.retryCount}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, retryCount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent"
                />
              ) : (
                <p className="text-[#5D5D5D]">{test.retryCount} {test.retryCount === 1 ? 'attempt' : 'attempts'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Retry Backoff Period (hours)
              </label>
              {editingSettings ? (
                <input
                  type="number"
                  min="0"
                  value={settingsForm.retryBackoffHours}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, retryBackoffHours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent"
                />
              ) : (
                <p className="text-[#5D5D5D]">{test.retryBackoffHours} hours</p>
              )}
            </div>
          </div>

          {editingSettings && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancelSettings}
                className="px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Test Questions</h2>
          <span className="text-sm text-[#5D5D5D]">
            {test.questions.length} {test.questions.length === 1 ? 'question' : 'questions'}
          </span>
        </div>
        <div className="space-y-6">
          {test.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#F8AF00] bg-opacity-20 text-[#F8AF00] font-bold rounded-full">
                    {index + 1}
                  </span>
                  <div>
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingQuestionId(question.id)}
                      className="p-2 text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded-lg transition-colors"
                      title="Edit question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!question.isManual && (
                      <button
                        onClick={() => handleRegenerateQuestion(question.id)}
                        disabled={regeneratingId === question.id}
                        className="p-2 text-[#5D5D5D] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Regenerate question"
                      >
                        <RefreshCw className={`w-4 h-4 ${regeneratingId === question.id ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(question)}
                      disabled={deletingId === question.id}
                      className="p-2 text-[#5D5D5D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Question Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">
                    {question.question || 'Enter your question...'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 border rounded-lg ${
                        option.id === question.correctAnswerId
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                          option.id === question.correctAnswerId
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {option.id.toUpperCase()}
                        </span>
                        <span className="text-black">
                          {option.text || 'Enter option text...'}
                        </span>
                        {option.id === question.correctAnswerId && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {test.questions.length === 0 && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No questions yet</h3>
              <p className="text-[#5D5D5D] mb-4">
                Add your first question to get started
              </p>
              <button
                onClick={handleAddManualQuestion}
                className="bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
              >
                Add Manual Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Modal */}
      {showStatistics && (
        <TestStatistics
          testId={test.id}
          onClose={() => setShowStatistics(false)}
        />
      )}

      {/* Question Editor Modal */}
      {editingQuestionId && (
        <QuestionEditor
          question={test.questions.find(q => q.id === editingQuestionId)!}
          onClose={() => setEditingQuestionId(null)}
          onSave={handleQuestionUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && questionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-black">Delete Question</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-[#5D5D5D] mb-3">
                Are you sure you want to delete this question?
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-black font-medium mb-2">
                  {questionToDelete.question || 'Untitled question'}
                </p>
                <div className="text-xs text-[#5D5D5D]">
                  {questionToDelete.isManual ? 'Manual question' : 'AI-generated question'}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId === questionToDelete.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {deletingId === questionToDelete.id ? 'Deleting...' : 'Delete Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};