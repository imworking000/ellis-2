import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Clock, Edit3, Trash2, User, Play, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { PlannedTest } from '../../types/plannedTest';
import { plannedTestService } from '../../services/plannedTestService';
import { PlannedTestModal } from './PlannedTestModal';

interface PlannedTestsListProps {
  onTestSelect: (testId: string) => void;
}

export const PlannedTestsList: React.FC<PlannedTestsListProps> = ({ onTestSelect }) => {
  const [plannedTests, setPlannedTests] = useState<PlannedTest[]>([]);
  const [filteredTests, setFilteredTests] = useState<PlannedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PlannedTest['status'] | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTest, setEditingTest] = useState<PlannedTest | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPlannedTests();
  }, []);

  const loadPlannedTests = async () => {
    try {
      const tests = await plannedTestService.getAllPlannedTests();
      setPlannedTests(tests);
      setFilteredTests(tests);
    } catch (error) {
      console.error('Failed to load planned tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tests when status filter or tests change
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTests(plannedTests);
    } else {
      setFilteredTests(plannedTests.filter(test => test.status === statusFilter));
    }
  }, [plannedTests, statusFilter]);

  const handleCreateSuccess = (newTest: PlannedTest) => {
    setPlannedTests(prev => [newTest, ...prev]);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedTest: PlannedTest) => {
    setPlannedTests(prev => prev.map(test => test.id === updatedTest.id ? updatedTest : test));
    setEditingTest(null);
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this planned test?')) return;
    
    setDeletingId(testId);
    try {
      await plannedTestService.deletePlannedTest(testId);
      setPlannedTests(prev => prev.filter(test => test.id !== testId));
    } catch (error) {
      console.error('Failed to delete planned test:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusIcon = (status: PlannedTest['status']) => {
    switch (status) {
      case 'planned':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-orange-500" />;
      case 'finished':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: PlannedTest['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
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

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })} at ${time}`;
  };

  const canEdit = (test: PlannedTest) => {
    return test.status === 'planned';
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Planned Tests</h1>
          <p className="text-[#5D5D5D]">Schedule and manage test sessions</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5D5D5D]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PlannedTest['status'] | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Schedule Test
          </button>
        </div>
      </div>

      {/* Planned Tests Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-black">Test</th>
                <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                <th className="text-left py-3 px-4 font-medium text-black">Scheduled</th>
                <th className="text-left py-3 px-4 font-medium text-black">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-black">Attendees</th>
                <th className="text-left py-3 px-4 font-medium text-black">Manager</th>
                <th className="text-right py-3 px-4 font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <button
                        onClick={() => onTestSelect(test.id)}
                        className="font-medium text-black hover:text-[#F8AF00] transition-colors cursor-pointer text-left"
                      >
                        {test.testName}
                      </button>
                      <div className="text-sm text-[#5D5D5D] mt-1">
                        {test.slug}
                      </div>
                      <div className="text-xs text-[#5D5D5D] mt-1 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                        {test.code}
                      </div>
                      {test.description && (
                        <div className="text-sm text-[#5D5D5D] mt-1">
                          {test.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className={getStatusBadge(test.status)}>
                        {test.status.replace('_', ' ').charAt(0).toUpperCase() + test.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#5D5D5D]" />
                      <div>
                        <div className="text-black">{formatDateTime(test.scheduledDate, test.startTime)}</div>
                        <div className="text-[#5D5D5D]">Until {test.endTime}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-[#5D5D5D]" />
                      <span className="text-black">{test.timeWindow} min</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#5D5D5D]" />
                      <span className="text-black">{test.attendees}</span>
                      {test.results && (
                        <span className="text-[#5D5D5D]">
                          ({test.results.filter(r => r.status === 'completed').length} completed)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-[#5D5D5D]" />
                      <span className="text-black">{test.responsibleManager}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit(test) && (
                        <button
                          onClick={() => setEditingTest(test)}
                          className="p-2 text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded-lg transition-colors"
                          title="Edit planned test"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {canEdit(test) && (
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          disabled={deletingId === test.id}
                          className="p-2 text-[#5D5D5D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete planned test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && !loading && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">
            {statusFilter === 'all' ? 'No planned tests' : `No ${statusFilter.replace('_', ' ')} tests`}
          </h3>
          <p className="text-[#5D5D5D] mb-4">
            {statusFilter === 'all' 
              ? 'Schedule your first test session'
              : `No tests found with status: ${statusFilter.replace('_', ' ')}`
            }
          </p>
          {statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
            >
              Schedule First Test
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTest) && (
        <PlannedTestModal
          plannedTest={editingTest}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTest(null);
          }}
          onSuccess={editingTest ? handleEditSuccess : handleCreateSuccess}
        />
      )}
    </div>
  );
};