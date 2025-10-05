export interface Document {
  id: string;
  name: string;
  state: 'processing' | 'draft' | 'published';
  version: number;
  uploadDate: string;
  lastModified: string;
  fileType: 'pdf' | 'txt';
  chapters: Chapter[];
  processingJobId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  level: number;
  parentId?: string;
  children: Chapter[];
  content: string;
  metadata: ChapterMetadata;
  hasChanges?: boolean; // For version highlighting
}

export interface ChapterMetadata {
  documentName: string;
  department: Department;
  tags: string[];
  description: string;
}

export type Department = 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Finance' | 'Operations';

export interface DocumentUpload {
  file: File;
  name: string;
}