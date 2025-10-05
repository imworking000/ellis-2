import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle, FileText, Target } from 'lucide-react';
import { Test, TestFormData, LabelFilter, QuestionEstimate } from '../../types/test';
import { testService } from '../../services/testService';
import { labelService } from '../../services/labelService';
import { Label } from '../../types/label';

interface TestCreateModalProps {
  onClose: () => void;
  onSuccess: (test: Test) => void;
}

export const TestCreateModal: React.FC<TestCreateModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<TestFormData>({
    name: '',
    description: '',
    maxQuestions: 10,
    selectedLabels: []
  });
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [estimate, setEstimate] = useState<QuestionEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLabels();
  }, []);

  useEffect(() => {
    if (formData.selectedLabels.length > 0) {
      estimateQuestions();
    } else {
      setEstimate(null);
    }
  }, [formData.selectedLabels]);

  const loadLabels = async () => {
    try {
      const labels = await labelService.getAllLabels();
      setAvailableLabels(labels);
    } catch (error) {
      console.error('Failed to load labels:', error);
    }
  };

  const estimateQuestions = async () => {
    setEstimating(true);
    try {
      const questionEstimate = await testService.estimateQuestions(formData.selectedLabels);
      setEstimate(questionEstimate);
    } catch (error) {
      console.error('Failed to estimate questions:', error);
    } finally {
      setEstimating(false);
    }
  };

  const handleAddLabel = () => {
    const unusedLabels = availableLabels.filter(
      label => !formData.selectedLabels.some(selected => selected.labelKey === label.key)
    );
    
    if (unusedLabels.length > 0) {
      const firstLabel = unusedLabels[0];
      const defaultValue = firstLabel.type === 'enum' ? firstLabel.enumOptions![0] : '';
      
      setFormData(prev => ({
        ...prev,
        selectedLabels: [
          ...prev.selectedLabels,
          {
            labelKey: firstLabel.key,
            labelName: firstLabel.displayName,
            value: defaultValue
          }
        ]
      }));
    }
  };

  const handleRemoveLabel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selectedLabels: prev.selectedLabels.filter((_, i) => i !== index)
    }));
  };

  const handleLabelChange = (index: number, field: 'labelKey' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLabels: prev.selectedLabels.map((label, i) => {
        if (i === index) {
          if (field === 'labelKey') {
            const selectedLabel = availableLabels.find(l => l.key === value);
            return {
              ...label,
              labelKey: value,
              labelName: selectedLabel?.displayName || value,
              value: selectedLabel?.type === 'enum' ? selectedLabel.enumOptions![0] : ''
            };
          }
          return { ...label, [field]: value };
        }
        return label;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Test name is required');
      return;
    }

    if (formData.selectedLabels.length === 0) {
      setError('At least one label filter is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newTest = await testService.createTest(formData);
      onSuccess(newTest);
    } catch (err) {
      setError('Failed to create test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableLabelsForSelect = (currentIndex: number) => {
    const usedKeys = formData.selectedLabels
      .map((_, i) => i !== currentIndex ? formData.selectedLabels[i].labelKey : null)
      .filter(Boolean);
    
    return availableLabels.filter(label => !usedKeys.includes(label.key));
  };

  const canAddMoreLabels = formData.selectedLabels.length < availableLabels.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Create New Test</h2>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Test Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              placeholder="e.g., React Fundamentals Assessment"
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none resize-none"
              placeholder="Brief description of what this test covers"
            />
          </div>

          {/* Max Questions */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Questions
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.maxQuestions}
              onChange={(e) => setFormData(prev => ({ ...prev, maxQuestions: parseInt(e.target.value) || 10 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
            />
          </div>

          {/* Label Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-black">
                Chapter Selection by Labels <span className="text-red-500">*</span>
              </label>
              {canAddMoreLabels && (
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Filter
                </button>
              )}
            </div>

            <div className="space-y-3">
              {formData.selectedLabels.map((labelFilter, index) => {
                const selectedLabel = availableLabels.find(l => l.key === labelFilter.labelKey);
                const availableForSelect = getAvailableLabelsForSelect(index);

                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <select
                      value={labelFilter.labelKey}
                      onChange={(e) => handleLabelChange(index, 'labelKey', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                    >
                      {availableForSelect.map(label => (
                        <option key={label.key} value={label.key}>
                          {label.displayName}
                        </option>
                      ))}
                    </select>

                    {selectedLabel?.type === 'enum' ? (
                      <select
                        value={labelFilter.value}
                        onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                      >
                        {selectedLabel.enumOptions?.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={labelFilter.value}
                        onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                        placeholder="Enter value"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(index)}
                      className="p-2 text-[#5D5D5D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {formData.selectedLabels.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-[#5D5D5D]">Add label filters to select chapters</p>
              </div>
            )}
          </div>

          {/* Question Estimate */}
          {estimate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Question Estimate</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Selected Chapters:</span>
                  <span className="font-medium text-blue-900">{estimate.totalChapters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Estimated Questions:</span>
                  <span className="font-medium text-blue-900">{estimate.estimatedQuestions}</span>
                </div>
              </div>
              
              {estimate.selectedDocuments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="text-xs text-blue-700 mb-2">Source Documents:</div>
                  {estimate.selectedDocuments.map((doc, index) => (
                    <div key={index} className="flex justify-between text-xs text-blue-600">
                      <span>{doc.documentName}</span>
                      <span>{doc.chapters} chapters, ~{doc.questions} questions</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading State for Estimate */}
          {estimating && !estimate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Question Estimate</h3>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Analyzing chapters...</span>
                  <div className="w-16 h-4 bg-blue-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Calculating questions...</span>
                  <div className="w-12 h-4 bg-blue-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || estimating}
              className="flex-1 px-4 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Creating...' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};