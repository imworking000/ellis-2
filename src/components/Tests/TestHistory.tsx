import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, Clock, BarChart3, CheckCircle, Play, XCircle, AlertCircle } from 'lucide-react';
import { TestHistory as TestHistoryType } from '../../types/test';
import { testService } from '../../services/testService';

interface TestHistoryProps {
  onBack: () => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<TestHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await testService.getTestHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load test history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: TestHistoryType['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestHistoryType['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in_progress':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#5D5D5D] hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tests
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <div>
          <h1 className="text-3xl font-bold text-black">Test History</h1>
          <p className="text-[#5D5D5D]">Track scheduled and completed test sessions</p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-black">Test</th>
                <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                <th className="text-left py-3 px-4 font-medium text-black">Scheduled Date</th>
                <th className="text-left py-3 px-4 font-medium text-black">Attendees</th>
                <th className="text-left py-3 px-4 font-medium text-black">Completion</th>
                <th className="text-left py-3 px-4 font-medium text-black">Average Score</th>
                <th className="text-right py-3 px-4 font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-black">{item.testName}</div>
                      <div className="text-sm text-[#5D5D5D]">
                        Duration: {item.duration} minutes
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={getStatusBadge(item.status)}>
                        {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#5D5D5D]" />
                      <span className="text-black">{formatDate(item.scheduledDate)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#5D5D5D]" />
                      <span className="text-black">{item.attendees}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="text-black font-medium">
                        {item.completedBy} / {item.attendees}
                      </div>
                      <div className="text-[#5D5D5D]">
                        {item.attendees > 0 ? Math.round((item.completedBy / item.attendees) * 100) : 0}% completed
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4 text-[#5D5D5D]" />
                      <span className="text-black">
                        {item.status === 'completed' ? `${item.averageScore}%` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-3 py-1 text-sm text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded transition-colors"
                        title="View details (coming soon)"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No test history</h3>
          <p className="text-[#5D5D5D]">
            Test sessions will appear here once they are scheduled
          </p>
        </div>
      )}
    </div>
  );
};