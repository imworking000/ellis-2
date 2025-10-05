import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { UserTestSession, UserTestQuestion, UserAnswer } from '../../types/userTest';
import { userTestService } from '../../services/userTestService';

interface UserTestInterfaceProps {
  session: UserTestSession;
  onTestComplete: () => void;
  onTimeUp: () => void;
}

export const UserTestInterface: React.FC<UserTestInterfaceProps> = ({
  session: initialSession,
  onTestComplete,
  onTimeUp
}) => {
  const [session, setSession] = useState<UserTestSession>(initialSession);
  const [questions, setQuestions] = useState<UserTestQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialSession.timeRemaining);

  useEffect(() => {
    loadQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        // Update session time remaining
        userTestService.updateTimeRemaining(session.id, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.id, onTimeUp]);

  // Load existing answer when question changes
  useEffect(() => {
    const currentQuestion = questions[session.currentQuestionIndex];
    if (currentQuestion) {
      const existingAnswer = session.answers.find(a => a.questionId === currentQuestion.id);
      setSelectedAnswer(existingAnswer?.selectedOptionId || '');
    }
  }, [session.currentQuestionIndex, questions, session.answers]);

  const loadQuestions = async () => {
    try {
      const testQuestions = await userTestService.getTestQuestions();
      setQuestions(testQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return;

    setSubmitting(true);
    try {
      const currentQuestion = questions[session.currentQuestionIndex];
      const updatedSession = await userTestService.submitAnswer(
        session.id,
        currentQuestion.id,
        selectedAnswer
      );
      setSession(updatedSession);

      // Check if this was the last question or if we've answered all questions
      if (isLastQuestion || updatedSession.currentQuestionIndex >= questions.length) {
        onTestComplete();
        return;
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((session.currentQuestionIndex + 1) / session.totalQuestions) * 100;
  };

  const isLastQuestion = session.currentQuestionIndex >= questions.length - 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  const currentQuestion = questions[session.currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">Question not found</h2>
          <p className="text-[#5D5D5D]">There was an error loading the current question.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">
                      {session.currentQuestionIndex + 1}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-[#F8AF00] rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">
                        {session.totalQuestions}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">
                    Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
                  </div>
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-[#F8AF00] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${timeRemaining < 300 ? 'text-red-500' : 'text-[#5D5D5D]'}`} />
              <span className={`font-mono text-lg font-bold ${
                timeRemaining < 300 ? 'text-red-500' : 'text-black'
              }`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black leading-relaxed">
              {currentQuestion.question}
            </h1>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                  selectedAnswer === option.id
                    ? 'border-[#F8AF00] bg-[#F8AF00] bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option.id
                      ? 'border-[#F8AF00] bg-[#F8AF00]'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option.id && (
                      <CheckCircle className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedAnswer === option.id
                          ? 'bg-[#F8AF00] text-black'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {option.id.toUpperCase()}
                      </span>
                      <span className="text-black text-lg">{option.text}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-[#5D5D5D]">
              {selectedAnswer ? 'Answer selected' : 'Please select an answer to continue'}
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer || submitting}
              className="flex items-center gap-2 bg-[#F8AF00] text-black px-6 py-3 rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  {isLastQuestion ? 'Finish Test' : 'Next Question'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};