import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Target, CheckCircle, LogOut, Award } from 'lucide-react';
import { UserTestResult } from '../../types/userTest';

interface UserTestResultsProps {
  result: UserTestResult;
  testName: string;
  onLogout: () => void;
}

export const UserTestResults: React.FC<UserTestResultsProps> = ({
  result,
  testName,
  onLogout
}) => {
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogout]);

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: 'Outstanding performance!', emoji: '🎉' };
    if (score >= 80) return { message: 'Great job!', emoji: '👏' };
    if (score >= 70) return { message: 'Good work!', emoji: '👍' };
    if (score >= 60) return { message: 'Keep practicing!', emoji: '💪' };
    return { message: 'Room for improvement', emoji: '📚' };
  };

  const performance = getPerformanceMessage(result.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${getScoreBgColor(result.score)}`}>
              <Trophy className={`w-8 h-8 ${getScoreColor(result.score)}`} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Test Completed!</h1>
          <p className="text-lg text-[#5D5D5D]">{testName}</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(result.score)} mb-4`}>
            <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}%
            </span>
          </div>
          <div className="text-2xl font-semibold text-black mb-2">
            {performance.message} {performance.emoji}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{result.correctAnswers}</div>
            <div className="text-sm text-blue-700">Correct Answers</div>
            <div className="text-xs text-blue-600 mt-1">
              out of {result.totalQuestions}
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
            </div>
            <div className="text-sm text-green-700">Accuracy</div>
            <div className="text-xs text-green-600 mt-1">
              success rate
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{result.duration}</div>
            <div className="text-sm text-purple-700">Duration</div>
            <div className="text-xs text-purple-600 mt-1">
              total time
            </div>
          </div>
        </div>

        {/* Completion Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#F8AF00]" />
              <div>
                <div className="font-medium text-black">Test Completed</div>
                <div className="text-sm text-[#5D5D5D]">
                  {new Date(result.completedAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#5D5D5D]">Final Score</div>
              <div className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
            </div>
          </div>
        </div>

        {/* Auto Logout Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-orange-800">Auto Logout</div>
              <div className="text-sm text-orange-700">
                You will be automatically logged out in {formatCountdown(countdown)}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-3 bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout Now
          </button>
          <p className="text-sm text-[#5D5D5D] mt-3">
            Thank you for taking the test!
          </p>
        </div>
      </div>
    </div>
  );
};