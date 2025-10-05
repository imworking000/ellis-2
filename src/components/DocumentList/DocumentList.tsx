import React, { useState, useEffect } from 'react';
import { Upload, FileText, Calendar, Edit3, Eye, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Document } from '../../types/document';
import { documentService } from '../../services/documentService';
import { DocumentUploadModal } from './DocumentUploadModal';

interface DocumentListProps {
  onDocumentSelect: (docId: string) => void;
  onJobSelect?: (jobId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ onDocumentSelect, onJobSelect }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await documentService.getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newDoc: Document) => {
    setDocuments(prev => [newDoc, ...prev]);
    setShowUploadModal(false);
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'published':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <Edit3 className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (state: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (state) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'draft':
        return `${baseClasses} bg-orange-100 text-orange-800`;
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
          <h1 className="text-3xl font-bold text-black mb-2">Document Library</h1>
          <p className="text-[#5D5D5D]">Manage your learning content and documentation</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] transition-colors font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Document List */}
      <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => doc.state !== 'processing' && onDocumentSelect(doc.id)}
              className={`bg-white border border-gray-200 rounded-lg p-6 transition-all ${
                doc.state === 'processing' 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:shadow-md hover:border-gray-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left side - Document info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`p-3 rounded-lg transition-colors ${
                    doc.state === 'processing'
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}>
                    <FileText className={`w-6 h-6 transition-colors ${
                      doc.state === 'processing'
                        ? 'text-blue-500'
                        : 'text-[#5D5D5D]'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-black text-lg truncate">{doc.name}</h3>
                      <span className={getStatusBadge(doc.state)}>
                        {doc.state.charAt(0).toUpperCase() + doc.state.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-[#5D5D5D]">
                      <span className="capitalize">{doc.fileType} document</span>
                      <span>•</span>
                      <span>Version {doc.version}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Modified {new Date(doc.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {doc.state === 'processing' ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                        <span className="text-xs text-blue-600">Processing document...</span>
                       {/* }{doc.processingJobId && onJobSelect && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onJobSelect(doc.processingJobId!);
                            }}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors ml-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Job
                          </button>
                        )} */}
                      </div>
                    ) : (
                      <div className="text-sm text-[#5D5D5D] mt-1">
                        {doc.chapters.length} chapter{doc.chapters.length !== 1 ? 's' : ''} available
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right side - Status icon */}
                <div className="flex items-center gap-3 ml-4">
                  {getStatusIcon(doc.state)}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};