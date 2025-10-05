import React, { useState, useEffect } from 'react';
import { X, User, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { TestStatistics as TestStats } from '../../types/test';
import { testService } from '../../services/testService';

interface TestStatisticsProps {
  testId: string;
  onClose: () => void;
}

export const TestStatistics: React.FC<TestStatisticsProps> = ({ testId, onClose }) => {
  const [statistics, setStatistics] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, [testId]);

  const loadStatistics = async () => {
    try {
      const stats = await testService.getTestStatistics(testId);
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const selectedAttemptData = statistics.attempts.find(a => a.attemptId === selectedAttempt);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-black">{statistics.testName} - Statistics</h2>
            <p className="text-sm text-[#5D5D5D] mt-1">Test performance and attempt history</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Attempts</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{statistics.totalAttempts}</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Pass Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{statistics.passRate}%</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Avg Score</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{statistics.averageScore}%</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Unique Users</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{statistics.uniqueUsers}</div>
            </div>
          </div>

          {/* Attempts List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-black">Attempt History</h3>
            </div>

            {statistics.attempts.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-[#5D5D5D]">No attempts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {statistics.attempts.map((attempt) => (
                  <div
                    key={attempt.attemptId}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedAttempt(
                      selectedAttempt === attempt.attemptId ? null : attempt.attemptId
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-black">{attempt.userName}</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              Attempt #{attempt.attemptNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-[#5D5D5D]">
                            <span>{new Date(attempt.startedAt).toLocaleString()}</span>
                            {attempt.completedAt && (
                              <>
                                <span>•</span>
                                <span>Completed: {new Date(attempt.completedAt).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {attempt.score !== undefined && (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              attempt.passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {attempt.score}%
                            </div>
                            <div className="text-xs text-[#5D5D5D]">
                              {attempt.pointsEarned}/{attempt.totalPoints} points
                            </div>
                          </div>
                        )}
                        <div>
                          {attempt.passed ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Passed
                            </div>
                          ) : attempt.completedAt ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Failed
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              In Progress
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Answer Details */}
                    {selectedAttempt === attempt.attemptId && attempt.answers.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-black mb-3">Answer Breakdown</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {attempt.answers.map((answer, index) => (
                            <div
                              key={answer.questionId}
                              className={`p-3 rounded-lg border ${
                                answer.isCorrect
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-red-50 border-red-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-black">
                                  Question {index + 1}
                                </span>
                                {answer.isCorrect ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-xs text-[#5D5D5D]">
                                {answer.pointsEarned} points earned
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
