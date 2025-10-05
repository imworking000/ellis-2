import React from 'react';
import { Clock, Users, FileText, Play, Calendar } from 'lucide-react';
import { UserTestSession } from '../../types/userTest';
import { PlannedTest } from '../../types/plannedTest';

interface UserTestWelcomeProps {
  session: UserTestSession;
  plannedTest: PlannedTest;
  onStartTest: () => void;
}

export const UserTestWelcome: React.FC<UserTestWelcomeProps> = ({
  session,
  plannedTest,
  onStartTest
}) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Welcome, {session.attendeeName}!</h1>
          <p className="text-lg text-[#5D5D5D]">You're ready to start the test</p>
        </div>

        {/* Test Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">{session.testName}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Questions</div>
                <div className="font-medium text-black">{session.totalQuestions} questions</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Time Limit</div>
                <div className="font-medium text-black">{formatTime(session.timeRemaining)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Test Code</div>
                <div className="font-medium text-black font-mono">{session.testCode}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm text-[#5D5D5D]">Started</div>
                <div className="font-medium text-black">
                  {new Date(session.startedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Test Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Answer all questions to the best of your ability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>You must select an answer before proceeding to the next question</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Keep an eye on the timer - the test will auto-submit when time runs out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Once you start, you cannot pause or restart the test</span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={onStartTest}
            className="inline-flex items-center gap-3 bg-[#F8AF00] text-black py-4 px-8 rounded-xl hover:bg-[#E69F00] transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6" />
            Start Test
          </button>
          <p className="text-sm text-[#5D5D5D] mt-3">
            Click the button above when you're ready to begin
          </p>
        </div>
      </div>
    </div>
  );
};