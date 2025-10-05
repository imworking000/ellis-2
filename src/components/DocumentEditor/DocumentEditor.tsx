import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Edit3, Save, Upload } from 'lucide-react';
import { Document } from '../../types/document';
import { documentService } from '../../services/documentService';
import { ChapterView } from '../ChapterView/ChapterView';
import { MetadataPanel } from '../MetadataPanel/MetadataPanel';
import { TextViewer } from '../TextViewer/TextViewer';
import { DocumentVersionUploadModal } from './DocumentVersionUploadModal';

interface DocumentEditorProps {
  documentId: string;
  onBack: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  documentId,
  onBack
}) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [isContentCollapsed, setIsContentCollapsed] = useState(true);
  const [showVersionUpload, setShowVersionUpload] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      const doc = await documentService.getDocument(documentId);
      setDocument(doc);
      // Auto-select first chapter if available
      if (doc?.chapters.length) {
        setSelectedChapterId(doc.chapters[0].id);
      }
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!document) return;
    
    setPublishing(true);
    try {
      const updatedDoc = await documentService.publishDocument(document.id);
      setDocument(updatedDoc);
    } catch (error) {
      console.error('Failed to publish document:', error);
    } finally {
      setPublishing(false);
    }
  };

  const handleVersionUploadSuccess = (updatedDoc: Document) => {
    setDocument(updatedDoc);
    setShowVersionUpload(false);
    // Reset selected chapter since chapters will be replaced
    setSelectedChapterId(null);
  };

  const selectedChapter = selectedChapterId 
    ? document?.chapters.find(ch => ch.id === selectedChapterId) ||
      document?.chapters.flatMap(ch => [ch, ...ch.children]).find(ch => ch.id === selectedChapterId)
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8AF00]"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-black mb-2">Document not found</h2>
          <button
            onClick={onBack}
            className="text-[#F8AF00] hover:text-[#E69F00] transition-colors"
          >
            Return to document list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#5D5D5D] hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Documents
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-black">{document.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  document.state === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {document.state === 'published' ? <Eye className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                  {document.state.charAt(0).toUpperCase() + document.state.slice(1)}
                </span>
                <span className="text-sm text-[#5D5D5D]">Version {document.version}</span>
              </div>
            </div>
          </div>
          
          {document.state === 'draft' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowVersionUpload(true)}
                className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload New Version
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 bg-[#F8AF00] text-black px-4 py-2 rounded-lg hover:bg-[#E69F00] disabled:opacity-50 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          )}
          
          {document.state === 'published' && (
            <button
              onClick={() => setShowVersionUpload(true)}
              className="flex items-center gap-2 border border-gray-300 text-[#5D5D5D] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload New Version
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex h-[calc(100vh-120px)]">
        {/* Left Panel - Chapter Navigation */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <ChapterView
            chapters={document.chapters}
            selectedChapterId={selectedChapterId}
            onChapterSelect={setSelectedChapterId}
            isReadonly={document.state === 'published'}
          />
        </div>

        {/* Right Panel - Metadata and Content */}
        <div className="flex-1 flex flex-col">
          {selectedChapter ? (
            <>
              <div className={`overflow-y-auto transition-all duration-300 ${
                isContentCollapsed ? 'flex-1' : 'flex-[2]'
              }`}>
                <MetadataPanel
                  chapter={selectedChapter}
                  documentId={document.id}
                  isReadonly={document.state === 'published'}
                />
              </div>
              <div className={`border-t border-gray-200 transition-all duration-300 ${
                isContentCollapsed ? 'h-16' : 'flex-1'
              }`}>
                <TextViewer 
                  chapterId={selectedChapter.id}
                  onToggleCollapse={() => setIsContentCollapsed(!isContentCollapsed)}
                  isCollapsed={isContentCollapsed}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium text-black mb-2">No chapter selected</h3>
                <p className="text-[#5D5D5D]">Select a chapter from the left panel to view its content and metadata</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version Upload Modal */}
      {showVersionUpload && (
        <DocumentVersionUploadModal
          document={document}
          onClose={() => setShowVersionUpload(false)}
          onUploadSuccess={handleVersionUploadSuccess}
        />
      )}
    </div>
  );
};