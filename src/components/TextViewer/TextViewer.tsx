import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { documentService } from '../../services/documentService';

interface TextViewerProps {
  chapterId: string;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export const TextViewer: React.FC<TextViewerProps> = ({ 
  chapterId, 
  onToggleCollapse,
  isCollapsed = true 
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, [chapterId]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const chapterContent = await documentService.getChapterContent(chapterId);
      setContent(chapterContent);
    } catch (error) {
      console.error('Failed to load chapter content:', error);
      setContent('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-gray-50 h-full transition-all duration-300 ${
      isCollapsed ? 'overflow-hidden' : ''
    }`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          isCollapsed ? 'flex-shrink-0' : ''
        }`}
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5D5D5D]" />
          <h3 className="font-medium text-black">Chapter Content</h3>
          <span className="text-xs text-[#5D5D5D]">
            (Click to {isCollapsed ? 'expand' : 'collapse'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              loadContent();
            }}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-1 text-sm text-[#5D5D5D] hover:text-black transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className={`transform transition-transform duration-200 ${
            isCollapsed ? '' : 'rotate-180'
          }`}>
            <svg className="w-4 h-4 text-[#5D5D5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-[#5D5D5D]">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F8AF00]"></div>
              Loading content...
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="prose max-w-none">
              <div className="text-[#5D5D5D] leading-relaxed whitespace-pre-wrap">
                {content || 'No content available for this chapter.'}
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};