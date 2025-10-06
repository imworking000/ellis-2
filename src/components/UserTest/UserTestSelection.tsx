import React from 'react';
import { GraduationCap, Clock, FileText, LogOut, CheckCircle, XCircle, AlertTriangle, Calendar } from 'lucide-react';
import { User, UserTestAssignment } from '../../types/userTest';

interface UserTestSelectionProps {
  user: User;
  assignments: UserTestAssignment[];
  onSelectTest: (testId: string) => void;
  onLogout: () => void;
}

export const UserTestSelection: React.FC<UserTestSelectionProps> = ({
  user,
  assignments,
  onSelectTest,
  onLogout
}) => {
  const getStatusBadge = (assignment: UserTestAssignment) => {
    if (!assignment.canTakeNow) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          Retry Cooldown
        </div>
      );
    }

    if (assignment.lastAttempt && !assignment.lastAttempt.passed) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          Failed
        </div>
      );
    }

    if (assignment.lastAttempt && assignment.lastAttempt.passed) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Passed
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
        <FileText className="w-4 h-4" />
        Not Started
      </div>
    );
  };

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const hasNoActiveTests = activeAssignments.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#F8AF00] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full">
                  <GraduationCap className="w-8 h-8 text-[#F8AF00]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black">Your Tests</h1>
                  <p className="text-black text-opacity-80">Welcome back, {user.name}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="p-6">
            {hasNoActiveTests ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-black mb-2">No Active Tests</h2>
                <p className="text-[#5D5D5D]">
                  You don't have any tests assigned at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-black mb-2">Available Tests</h2>
                  <p className="text-[#5D5D5D] text-sm">
                    Select a test to begin or continue
                  </p>
                </div>

                {activeAssignments.map((assignment) => (
                  <div
                    key={assignment.testId}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#F8AF00] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-black">
                            {assignment.testName}
                          </h3>
                          {getStatusBadge(assignment)}
                        </div>
                        <p className="text-[#5D5D5D] text-sm mb-4">
                          {assignment.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-[#5D5D5D]">
                            <Clock className="w-4 h-4" />
                            {assignment.duration} minutes
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#5D5D5D]">
                            <FileText className="w-4 h-4" />
                            {assignment.questionCount} questions
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-[#5D5D5D]">
                            Attempts: <span className="font-medium text-black">{assignment.attemptsUsed} / {assignment.maxAttempts}</span>
                          </div>
                          {assignment.lastAttempt && (
                            <div className="text-[#5D5D5D]">
                              Last Score: <span className={`font-medium ${assignment.lastAttempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                                {assignment.lastAttempt.score}%
                              </span>
                            </div>
                          )}
                        </div>

                        {assignment.retryMessage && (
                          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-orange-800">{assignment.retryMessage}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => onSelectTest(assignment.testId)}
                        disabled={!assignment.canTakeNow}
                        className="flex items-center gap-2 bg-[#F8AF00] text-black px-6 py-3 rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {assignment.lastAttempt ? 'Retake Test' : 'Start Test'}
                      </button>
                    </div>
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
