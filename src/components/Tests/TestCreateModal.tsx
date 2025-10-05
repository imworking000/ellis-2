import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { Test, TestFormData, Certificate } from '../../types/test';
import { testService } from '../../services/testService';

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
    questionCount: 10,
    duration: 30,
    certificateId: undefined,
    minSuccessPercentage: 70,
    retryCount: 3,
    retryBackoffHours: 24,
    documents: []
  });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const certs = await testService.getCertificates();
      setCertificates(certs);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        file => file.type === 'application/pdf' || file.type === 'text/plain'
      );
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Test name is required');
      return;
    }

    if (formData.documents.length === 0) {
      setError('At least one document is required');
      return;
    }

    if (formData.questionCount < 1 || formData.questionCount > 100) {
      setError('Question count must be between 1 and 100');
      return;
    }

    if (formData.duration < 5) {
      setError('Duration must be at least 5 minutes');
      return;
    }

    if (formData.minSuccessPercentage < 0 || formData.minSuccessPercentage > 100) {
      setError('Success percentage must be between 0 and 100');
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

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive ? 'border-[#F8AF00] bg-[#F8AF00] bg-opacity-5' : 'border-gray-300'
            }`}
          >
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="text-[#F8AF00] hover:text-[#E69F00] font-medium">
                  Click to upload
                </span>
                <span className="text-[#5D5D5D]"> or drag and drop</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-[#5D5D5D] mt-2">PDF or TXT files</p>
            </div>

            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#5D5D5D]" />
                      <span className="text-sm text-black">{doc.name}</span>
                      <span className="text-xs text-[#5D5D5D]">
                        ({(doc.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="p-1 text-[#5D5D5D] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.questionCount}
                onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 10 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Certificate (Optional)
            </label>
            <select
              value={formData.certificateId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, certificateId: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
            >
              <option value="">No certificate</option>
              {certificates.map(cert => (
                <option key={cert.id} value={cert.id}>
                  {cert.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Pass % Required
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.minSuccessPercentage}
                onChange={(e) => setFormData(prev => ({ ...prev, minSuccessPercentage: parseInt(e.target.value) || 70 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Max Retries
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.retryCount}
                onChange={(e) => setFormData(prev => ({ ...prev, retryCount: parseInt(e.target.value) || 3 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Retry Wait (hrs)
              </label>
              <input
                type="number"
                min="0"
                value={formData.retryBackoffHours}
                onChange={(e) => setFormData(prev => ({ ...prev, retryBackoffHours: parseInt(e.target.value) || 24 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

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
              disabled={loading}
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
