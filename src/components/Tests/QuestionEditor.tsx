import React, { useState } from 'react';
import { X, Save, CheckCircle } from 'lucide-react';
import { TestQuestion } from '../../types/test';
import { testService } from '../../services/testService';

interface QuestionEditorProps {
  question: TestQuestion;
  onClose: () => void;
  onSave: (question: TestQuestion) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    question: question.question,
    options: question.options.map(opt => ({ ...opt })),
    correctAnswerId: question.correctAnswerId
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOptionChange = (optionId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId ? { ...opt, text } : opt
      )
    }));
  };

  const handleCorrectAnswerChange = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      correctAnswerId: optionId
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.question.trim()) {
      setError('Question text is required');
      return;
    }

    const hasEmptyOptions = formData.options.some(opt => !opt.text.trim());
    if (hasEmptyOptions) {
      setError('All option texts are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updatedQuestion: TestQuestion = {
        ...question,
        question: formData.question,
        options: formData.options,
        correctAnswerId: formData.correctAnswerId,
        updatedAt: new Date().toISOString()
      };

      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave(updatedQuestion);
    } catch (err) {
      setError('Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Edit Question</h2>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none resize-none"
              placeholder="Enter your question..."
            />
          </div>

          {/* Answer Options */}
          <div>
            <label className="block text-sm font-medium text-black mb-3">
              Answer Options <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {formData.options.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCorrectAnswerChange(option.id)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                      option.id === formData.correctAnswerId
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                    title="Mark as correct answer"
                  >
                    {option.id === formData.correctAnswerId ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">
                        {option.id.toUpperCase()}
                      </span>
                    )}
                  </button>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
                    placeholder={`Option ${option.id.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-[#5D5D5D] mt-2">
              Click the circle next to an option to mark it as the correct answer
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {saving ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </div>
    </div>
  );
};