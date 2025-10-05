import React from 'react';
import { ChevronRight, ChevronDown, FileText, AlertTriangle } from 'lucide-react';
import { Chapter } from '../../types/document';

interface ChapterViewProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onChapterSelect: (chapterId: string) => void;
  isReadonly: boolean;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapters,
  selectedChapterId,
  onChapterSelect,
  isReadonly
}) => {
  const [expandedChapters, setExpandedChapters] = React.useState<Set<string>>(() => {
    // Expand all chapters by default
    const allChapterIds = new Set<string>();
    const collectIds = (chapters: Chapter[]) => {
      chapters.forEach(chapter => {
        allChapterIds.add(chapter.id);
        if (chapter.children) {
          collectIds(chapter.children);
        }
      });
    };
    collectIds(chapters);
    return allChapterIds;
  });

  const toggleExpanded = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const renderChapter = (chapter: Chapter, depth: number = 0) => {
    const isSelected = chapter.id === selectedChapterId;
    const isExpanded = expandedChapters.has(chapter.id);
    const hasChildren = chapter.children && chapter.children.length > 0;
    const paddingLeft = depth * 20 + 16;

    return (
      <div key={chapter.id}>
        <div
          className={`flex items-center gap-2 py-2 px-4 cursor-pointer transition-colors relative ${
            isSelected
              ? 'bg-[#F8AF00] bg-opacity-10 border-r-2 border-[#F8AF00]'
              : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft }}
          onClick={() => onChapterSelect(chapter.id)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(chapter.id);
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-[#5D5D5D]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#5D5D5D]" />
              )}
            </button>
          )}

          {/* Chapter Icon */}
          <div className={`p-1 rounded ${isSelected ? 'bg-[#F8AF00] bg-opacity-20' : 'bg-gray-100'}`}>
            <FileText className={`w-4 h-4 ${isSelected ? 'text-[#F8AF00]' : 'text-[#5D5D5D]'}`} />
          </div>

          {/* Chapter Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium truncate ${
                isSelected ? 'text-black' : 'text-black'
              }`}>
                {chapter.title}
              </span>
              
              {/* Change Badge */}
              {chapter.hasChanges && !isReadonly && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                  <span className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-medium">
                    Changed
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#5D5D5D]">
                Level {chapter.level}
              </span>
              {chapter.children.length > 0 && (
                <>
                  <span className="text-xs text-[#5D5D5D]">•</span>
                  <span className="text-xs text-[#5D5D5D]">
                    {chapter.children.length} subsection{chapter.children.length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div>
            {chapter.children.map(child => renderChapter(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-black mb-1">Chapters</h2>
        <p className="text-sm text-[#5D5D5D]">
          {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Chapter List */}
      <div className="overflow-y-auto">
        {chapters.length > 0 ? (
          chapters.map(chapter => renderChapter(chapter))
        ) : (
          <div className="p-4 text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-[#5D5D5D]">No chapters available</p>
          </div>
        )}
      </div>
    </div>
  );
};