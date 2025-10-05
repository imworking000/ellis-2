import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, User, AlertCircle } from 'lucide-react';
import { PlannedTest, PlannedTestFormData } from '../../types/plannedTest';
import { plannedTestService } from '../../services/plannedTestService';
import { testService } from '../../services/testService';
import { Test } from '../../types/test';

interface PlannedTestModalProps {
  plannedTest?: PlannedTest | null;
  onClose: () => void;
  onSuccess: (plannedTest: PlannedTest) => void;
}

export const PlannedTestModal: React.FC<PlannedTestModalProps> = ({
  plannedTest,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<PlannedTestFormData>({
    testId: '',
    code: '',
    scheduledDate: '',
    startTime: '09:00',
    timeWindow: 60,
    attendees: 10,
    responsibleManager: '',
    description: ''
  });
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAvailableTests();
    if (plannedTest) {
      setFormData({
        testId: plannedTest.testId,
        code: plannedTest.code,
        scheduledDate: plannedTest.scheduledDate,
        startTime: plannedTest.startTime,
        timeWindow: plannedTest.timeWindow,
        attendees: plannedTest.attendees,
        responsibleManager: plannedTest.responsibleManager,
        description: plannedTest.description || ''
      });
    }
  }, [plannedTest]);

  const loadAvailableTests = async () => {
    try {
      const tests = await testService.getAllTests();
      setAvailableTests(tests.filter(test => test.status === 'published'));
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
  };

  const selectedTest = availableTests.find(test => test.id === formData.testId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testId || !formData.code.trim() || !formData.scheduledDate || !formData.responsibleManager.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate date is not in the past (only for new tests)
    if (!plannedTest) {
      const selectedDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setError('Cannot schedule test in the past');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let savedTest: PlannedTest;
      if (plannedTest) {
        savedTest = await plannedTestService.updatePlannedTest(plannedTest.id, formData);
      } else {
        savedTest = await plannedTestService.createPlannedTest(formData);
      }
      onSuccess(savedTest);
    } catch (err) {
      setError('Failed to save planned test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const isReadOnly = plannedTest && plannedTest.status !== 'planned';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            {plannedTest ? 
              (isReadOnly ? 'View Planned Test' : 'Edit Planned Test') : 
              'Schedule New Test'
            }
          </h2>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Selection */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Test <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.testId}
              onChange={(e) => setFormData(prev => ({ ...prev, testId: e.target.value }))}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
            >
              <option value="">Select a test</option>
              {availableTests.map(test => (
                <option key={test.id} value={test.id} className={test.hasDeprecatedContent ? 'text-orange-600' : ''}>
                  {test.name} {test.hasDeprecatedContent ? '⚠️' : ''}
                </option>
              ))}
            </select>
            
            {/* Deprecated Content Warning */}
            {selectedTest?.hasDeprecatedContent && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Deprecated Content Warning</span>
                </div>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>This test contains questions from outdated document versions:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    {selectedTest.sourceDocuments
                      .filter(doc => doc.isDeprecated)
                      .map((doc, index) => (
                        <li key={index}>
                          <strong>{doc.documentName}</strong> (using v{doc.version}, current: v{doc.currentVersion})
                        </li>
                      ))}
                  </ul>
                  <p className="mt-2 text-xs">
                    <strong>Recommendation:</strong> Update the test with current document versions before scheduling to ensure accuracy.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Test Code */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Test Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D] font-mono"
              placeholder="e.g., REACT-2024-001"
            />
            <p className="text-xs text-[#5D5D5D] mt-1">
              Unique identifier for this test session
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                <Calendar className="w-4 h-4" />
                Scheduled Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                <Clock className="w-4 h-4" />
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
              />
            </div>
          </div>

          {/* Duration and Attendees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                step="15"
                value={formData.timeWindow}
                onChange={(e) => setFormData(prev => ({ ...prev, timeWindow: parseInt(e.target.value) || 60 }))}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
              />
              <p className="text-xs text-[#5D5D5D] mt-1">
                End time: {calculateEndTime(formData.startTime, formData.timeWindow)}
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                <Users className="w-4 h-4" />
                Expected Attendees
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={formData.attendees}
                onChange={(e) => setFormData(prev => ({ ...prev, attendees: parseInt(e.target.value) || 10 }))}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
              />
            </div>
          </div>

          {/* Responsible Manager */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
              <User className="w-4 h-4" />
              Responsible Manager <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.responsibleManager}
              onChange={(e) => setFormData(prev => ({ ...prev, responsibleManager: e.target.value }))}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
              placeholder="Enter manager name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isReadOnly}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none resize-none disabled:bg-gray-50 disabled:text-[#5D5D5D]"
              placeholder="Optional description for this test session"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Saving...' : (plannedTest ? 'Update Test' : 'Schedule Test')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};