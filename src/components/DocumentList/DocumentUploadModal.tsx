import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Document } from '../../types/document';
import { documentService } from '../../services/documentService';
import { jobService } from '../../services/jobService';

interface DocumentUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (document: Document) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  onClose,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a PDF or TXT file');
        return;
      }
      setFile(selectedFile);
      setDocumentName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !documentName.trim()) {
      setError('Please select a file and enter a document name');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const newDoc = await documentService.uploadDocument({
        file,
        name: documentName.trim()
      });
      
      // Create processing job
      await jobService.createDocumentProcessingJob(newDoc.id, newDoc.name);
      
      onUploadSuccess(newDoc);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F8AF00] transition-colors">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Upload className="w-6 h-6 text-[#5D5D5D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#5D5D5D]">PDF or TXT files only</p>
                </div>
              </div>
            </label>
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-[#F8AF00]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-black">{file.name}</p>
                <p className="text-xs text-[#5D5D5D]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {/* Document Name Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F8AF00] focus:border-transparent outline-none"
              placeholder="Enter document name"
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
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || !documentName.trim() || uploading}
              className="flex-1 px-4 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};