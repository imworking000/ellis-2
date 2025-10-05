import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Document } from '../../types/document';
import { documentService } from '../../services/documentService';
import { jobService } from '../../services/jobService';

interface DocumentVersionUploadModalProps {
  document: Document;
  onClose: () => void;
  onUploadSuccess: (document: Document) => void;
}

export const DocumentVersionUploadModal: React.FC<DocumentVersionUploadModalProps> = ({
  document,
  onClose,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
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
      
      // Check if file type matches the original document
      const expectedType = document.fileType === 'pdf' ? 'application/pdf' : 'text/plain';
      if (selectedFile.type !== expectedType) {
        setError(`Please select a ${document.fileType.toUpperCase()} file to match the original document type`);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const updatedDoc = await documentService.uploadDocumentVersion(document.id, file);
      
      // Create processing job
      await jobService.createDocumentProcessingJob(updatedDoc.id, updatedDoc.name);
      
      onUploadSuccess(updatedDoc);
    } catch (err) {
      setError('Failed to upload new version. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Upload New Version</h2>
          <button
            onClick={onClose}
            className="text-[#5D5D5D] hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Current Document Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#5D5D5D]" />
              <div>
                <div className="font-medium text-black">{document.name}</div>
                <div className="text-sm text-[#5D5D5D]">
                  Current version: {document.version} • {document.fileType.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">New Version: {document.version + 1}</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The document will be locked during processing</li>
              <li>• All existing chapters will be replaced</li>
              <li>• Tests using this document may be affected</li>
              <li>• File type must match: {document.fileType.toUpperCase()}</li>
            </ul>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F8AF00] transition-colors">
            <input
              type="file"
              accept={document.fileType === 'pdf' ? '.pdf' : '.txt'}
              onChange={handleFileChange}
              className="hidden"
              id="version-file-upload"
            />
            <label htmlFor="version-file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Upload className="w-6 h-6 text-[#5D5D5D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    Click to upload new version
                  </p>
                  <p className="text-xs text-[#5D5D5D]">
                    {document.fileType.toUpperCase()} files only
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">{file.name}</p>
                <p className="text-xs text-green-700">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                </p>
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
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#5D5D5D] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 px-4 py-2 bg-[#F8AF00] text-black rounded-lg hover:bg-[#E69F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload Version'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};