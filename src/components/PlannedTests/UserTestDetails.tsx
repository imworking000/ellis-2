import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Clock, CheckCircle, XCircle, Calendar, Target, Award } from 'lucide-react';
import { TestResult } from '../../types/plannedTest';
import { plannedTestService } from '../../services/plannedTestService';

interface UserTestDetailsProps {
  plannedTestId: string;
  userId: string;
  onBack: () => void;
}

export const UserTestDetails: React.FC<UserTestDetailsProps> = ({
  plannedTestId,
  userId,
  onBack
}) => {
  const [userResult, setUserResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserResult();
  }, [plannedTestId, userId]);

  const loadUserResult = async () => {
    try {
      const plannedTest = await plannedTestService.getPlannedTest(plannedTestId);
      if (plannedTest?.results) {
        const result = plannedTest.results.find(r => r.attendeeId === userId);
        setUserResult(result || null);
      }
    } catch (error) {
      console.error('Failed to load user result:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return '-';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end.getTime() - start.getTime()) / 60000);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getAnswerStatusIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  if (!userResult) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-black mb-2">User result not found</h2>
          <button
            onClick={onBack}
            className="text-[#F8AF00] hover:text-[#E69F00] transition-colors"
          >
            Return to test details
          </button>
        </div>
      </div>
    );
  }

  const correctAnswers = userResult.answers.filter(a => a.isCorrect).length;
  const totalAnswers = userResult.answers.length;

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
              Back to Test Details
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-black">{userResult.attendeeName}'s Test Results</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-[#5D5D5D]">{userResult.attendeeEmail}</span>
                <div className="flex items-center gap-2">
                  {userResult.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userResult.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userResult.status.charAt(0).toUpperCase() + userResult.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Test Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Started At</div>
                <div className="font-medium text-black">
                  {formatDateTime(userResult.startedAt)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Duration</div>
                <div className="font-medium text-black">
                  {formatDuration(userResult.startedAt, userResult.completedAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Questions</div>
                <div className="font-medium text-black">
                  {correctAnswers} / {totalAnswers} correct
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Final Score</div>
                <div className="font-medium text-black">
                  {userResult.score !== undefined ? `${userResult.score}%` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Question by Question Review</h2>
          
          <div className="space-y-6">
            {userResult.answers.map((answer, index) => (
              <div key={answer.questionId} className="border border-gray-200 rounded-lg p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-bold rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-black mb-1">
                        {answer.questionText}
                      </h3>
                      <div className="text-sm text-[#5D5D5D]">
                        Answered at {formatDateTime(answer.answeredAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getAnswerStatusIcon(answer.isCorrect)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      answer.isCorrect 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {answer.allOptions.map((option) => {
                    const isSelected = option.id === answer.selectedOptionId;
                    const isCorrect = option.id === answer.correctOption.id;
                    
                    let optionClass = 'p-3 border rounded-lg ';
                    if (isSelected && isCorrect) {
                      optionClass += 'border-green-500 bg-green-50';
                    } else if (isSelected && !isCorrect) {
                      optionClass += 'border-red-500 bg-red-50';
                    } else if (!isSelected && isCorrect) {
                      optionClass += 'border-green-300 bg-green-25';
                    } else {
                      optionClass += 'border-gray-200 bg-gray-50';
                    }

                    return (
                      <div key={option.id} className={optionClass}>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                            isSelected && isCorrect ? 'bg-green-500 text-white' :
                            isSelected && !isCorrect ? 'bg-red-500 text-white' :
                            !isSelected && isCorrect ? 'bg-green-300 text-green-800' :
                            'bg-gray-300 text-gray-700'
                          }`}>
                            {option.id.toUpperCase()}
                          </span>
                          <span className="text-black flex-1">
                            {option.text}
                          </span>
                          {isSelected && (
                            <span className="text-xs font-medium text-blue-600">
                              Selected
                            </span>
                          )}
                          {!isSelected && isCorrect && (
                            <span className="text-xs font-medium text-green-600">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};