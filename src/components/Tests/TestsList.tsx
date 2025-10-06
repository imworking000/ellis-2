import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Users, AlertTriangle, Pencil, Eye, Trash2, Loader2, ExternalLink, Lock, Unlock } from 'lucide-react';
import { Test } from '../../types/test';
import { testService } from '../../services/testService';
import { jobService } from '../../services/jobService';
import { TestCreateModal } from './TestCreateModal';

interface TestsListProps {
  onTestSelect: (testId: string) => void;
  onJobSelect?: (jobId: string) => void;
}

export const TestsList: React.FC<TestsListProps> = ({ onTestSelect, onJobSelect }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
    
    // Set up polling for processing tests
    const interval = setInterval(() => {
      if (tests.some(test => test.status === 'processing')) {
        loadTests();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Add polling dependency
  useEffect(() => {
    const interval = setInterval(() => {
      if (tests.some(test => test.status === 'processing')) {
        loadTests();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [tests]);

  const loadTests = async () => {
    try {
      const testsList = await testService.getAllTests();
      setTests(testsList);
    } catch (error) {
      console.error('Failed to load tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newTest: Test) => {
    setTests(prev => [newTest, ...prev]);
    setShowCreateModal(false);
    
    // Create processing job for the new test
    if (newTest.processingJobId) {
      jobService.createTestCreationJob(newTest.id, newTest.name);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    
    setDeletingId(testId);
    try {
      await testService.deleteTest(testId);
      setTests(prev => prev.filter(test => test.id !== testId));
    } catch (error) {
      console.error('Failed to delete test:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusIcon = (status: Test['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'published':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <Pencil className="w-4 h-4 text-orange-500" />;
      case 'archived':
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Test['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'draft':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
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
          <h1 className="text-3xl font-bold text-black mb-2">Tests</h1>
          <p className="text-[#5D5D5D]">Create and manage assessments from your documents</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Test
          </button>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-black">Test</th>
                <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                <th className="text-left py-3 px-4 font-medium text-black">Questions</th>
                <th className="text-left py-3 px-4 font-medium text-black">Sources</th>
                <th className="text-left py-3 px-4 font-medium text-black">Updated</th>
                <th className="text-right py-3 px-4 font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-3 ${
                      test.status === 'processing' ? 'opacity-75' : ''
                    }`}>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className={`w-4 h-4 ${
                          test.status === 'processing' ? 'text-blue-500' : 'text-[#5D5D5D]'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => test.status !== 'processing' && onTestSelect(test.id)}
                            className={`font-medium text-black transition-colors ${
                              test.status === 'processing' 
                                ? 'cursor-not-allowed' 
                                : 'hover:text-[#F8AF00] cursor-pointer'
                            }`}
                            disabled={test.status === 'processing'}
                          >
                            {test.name}
                          </button>
                        </div>
                        <div className="text-sm text-[#5D5D5D] mt-1">{test.description}</div>
                        {test.status === 'processing' && (
                          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Creating test questions...
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      {test.status === 'active' && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium w-fit">
                          <Lock className="w-3 h-3" />
                          Published
                        </div>
                      )}
                      {test.status === 'inactive' && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium w-fit">
                          <Unlock className="w-3 h-3" />
                          Draft
                        </div>
                      )}
                      {test.status === 'processing' && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium w-fit">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="text-black font-medium">{test.questions.length}</div>
                      {test.status === 'processing' ? (
                        <div className="flex items-center justify-between">
                          <div className="text-[#5D5D5D]">
                            Generating questions...
                          </div>
                          {/* {test.processingJobId && onJobSelect && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onJobSelect(test.processingJobId!);
                              }}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Job
                            </button>
                          )} */}
                        </div>
                      ) : (
                        <div className="text-[#5D5D5D]">Questions ready</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-[#5D5D5D]">
                      {test.documents.length} document{test.documents.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-[#5D5D5D]">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(test.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => test.status !== 'processing' && onTestSelect(test.id)}
                        disabled={test.status === 'processing'}
                        className="p-2 text-[#5D5D5D] hover:text-[#F8AF00] hover:bg-[#F8AF00] hover:bg-opacity-10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit questions"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        disabled={deletingId === test.id || test.status === 'processing'}
                        className="p-2 text-[#5D5D5D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete test"
                      >
                        <Trash2 className="w-4 h-4" />
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
      {tests.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No tests created</h3>
          <p className="text-[#5D5D5D] mb-4">
            Create your first test from document content
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
          >
            Create First Test
          </button>
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateModal && (
        <TestCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};