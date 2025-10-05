import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Users, User, CheckCircle, XCircle, Play, AlertTriangle, Mail, Eye } from 'lucide-react';
import { PlannedTest, TestResult } from '../../types/plannedTest';
import { plannedTestService } from '../../services/plannedTestService';
import { UserTestDetails } from './UserTestDetails';

interface PlannedTestDetailsProps {
  testId: string;
  onBack: () => void;
}

export const PlannedTestDetails: React.FC<PlannedTestDetailsProps> = ({
  testId,
  onBack
}) => {
  const [plannedTest, setPlannedTest] = useState<PlannedTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadPlannedTest();
  }, [testId]);

  const loadPlannedTest = async () => {
    try {
      const test = await plannedTestService.getPlannedTest(testId);
      setPlannedTest(test);
    } catch (error) {
      console.error('Failed to load planned test:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: PlannedTest['status']) => {
    switch (status) {
      case 'planned':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-orange-500" />;
      case 'finished':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: PlannedTest['status']) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'planned':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in_progress':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'finished':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getResultStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-orange-500" />;
      case 'abandoned':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResultStatusBadge = (status: TestResult['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'in_progress':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'abandoned':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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
    return `${duration} min`;
  };

  // If viewing user details, show that component
  if (selectedUserId) {
    return (
      <UserTestDetails 
        plannedTestId={testId}
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  if (!plannedTest) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-black mb-2">Planned test not found</h2>
          <button
            onClick={onBack}
            className="text-[#F8AF00] hover:text-[#E69F00] transition-colors"
          >
            Return to planned tests
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
              Back to Planned Tests
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-black">{plannedTest.testName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-[#5D5D5D]">{plannedTest.slug}</span>
                <span className="text-xs text-[#5D5D5D] font-mono bg-gray-100 px-2 py-1 rounded">
                  {plannedTest.code}
                </span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(plannedTest.status)}
                  <span className={getStatusBadge(plannedTest.status)}>
                    {plannedTest.status.replace('_', ' ').charAt(0).toUpperCase() + plannedTest.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Test Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Test Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#5D5D5D]" />
              <div>
                <div className="text-sm text-[#5D5D5D]">Scheduled Date</div>
                <div className="font-medium text-black">
                  {new Date(plannedTest.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#5D5D5D]" />
              <div>
                <div className="text-sm text-[#5D5D5D]">Time Window</div>
                <div className="font-medium text-black">
                  {plannedTest.startTime} - {plannedTest.endTime}
                </div>
                <div className="text-sm text-[#5D5D5D]">
                  ({plannedTest.timeWindow} minutes)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#5D5D5D]" />
              <div>
                <div className="text-sm text-[#5D5D5D]">Attendees</div>
                <div className="font-medium text-black">{plannedTest.attendees}</div>
                {plannedTest.results && (
                  <div className="text-sm text-[#5D5D5D]">
                    {plannedTest.results.filter(r => r.status === 'completed').length} completed
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#5D5D5D]" />
              <div>
                <div className="text-sm text-[#5D5D5D]">Responsible Manager</div>
                <div className="font-medium text-black">{plannedTest.responsibleManager}</div>
              </div>
            </div>
          </div>
          {plannedTest.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-[#5D5D5D] mb-2">Description</div>
              <div className="text-black">{plannedTest.description}</div>
            </div>
          )}
        </div>

        {/* Results Section - Only show for finished tests */}
        {plannedTest.status === 'finished' && plannedTest.results && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Test Results</h2>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{plannedTest.results.length}</div>
                <div className="text-sm text-[#5D5D5D]">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {plannedTest.results.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-[#5D5D5D]">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {plannedTest.results.filter(r => r.status === 'abandoned').length}
                </div>
                <div className="text-sm text-[#5D5D5D]">Abandoned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F8AF00]">
                  {plannedTest.results.filter(r => r.status === 'completed').length > 0
                    ? Math.round(
                        plannedTest.results
                          .filter(r => r.status === 'completed' && r.score !== undefined)
                          .reduce((sum, r) => sum + (r.score || 0), 0) /
                        plannedTest.results.filter(r => r.status === 'completed' && r.score !== undefined).length
                      )
                    : 0}%
                </div>
                <div className="text-sm text-[#5D5D5D]">Average Score</div>
              </div>
            </div>

            {/* Individual Results */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-black">Participant</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Started</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Completed</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {plannedTest.results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-black">{result.attendeeName}</div>
                          <div className="flex items-center gap-1 text-sm text-[#5D5D5D]">
                            <Mail className="w-3 h-3" />
                            {result.attendeeEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getResultStatusIcon(result.status)}
                          <span className={getResultStatusBadge(result.status)}>
                            {result.status.replace('_', ' ').charAt(0).toUpperCase() + result.status.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-black">
                          {formatDateTime(result.startedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-black">
                          {result.completedAt ? formatDateTime(result.completedAt) : '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-black">
                          {formatDuration(result.startedAt, result.completedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-black">
                          {result.score !== undefined ? `${result.score}%` : '-'}
                        </div>
                        {result.status === 'completed' && (
                          <button
                            onClick={() => setSelectedUserId(result.attendeeId)}
                            className="mt-1 flex items-center gap-1 text-xs text-[#F8AF00] hover:text-[#E69F00] transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* In Progress Message */}
        {plannedTest.status === 'in_progress' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <Play className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-orange-800 mb-2">Test in Progress</h3>
            <p className="text-orange-700">
              This test is currently running. Results will be available once the test is completed.
            </p>
          </div>
        )}

        {/* Planned Message */}
        {plannedTest.status === 'planned' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-800 mb-2">Test Scheduled</h3>
            <p className="text-blue-700">
              This test is scheduled for {formatDateTime(`${plannedTest.scheduledDate}T${plannedTest.startTime}:00`)}. 
              Results will be available after completion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};