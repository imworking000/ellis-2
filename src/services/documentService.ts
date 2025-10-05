import { Document, Chapter, Department, DocumentUpload } from '../types/document';

// Dummy data for development
const createSampleChapters = (docId: string): Chapter[] => [
  {
    id: `${docId}-ch1`,
    title: "Introduction to React",
    level: 1,
    children: [
      {
        id: `${docId}-ch1-1`,
        title: "What is React?",
        level: 2,
        parentId: `${docId}-ch1`,
        children: [],
        content: "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the open-source community. React allows developers to create large web applications that can change data, without reloading the page.",
        metadata: {
          documentName: "React Fundamentals Guide",
          department: 'Engineering' as Department,
          tags: ['react', 'javascript', 'frontend'],
          description: "Basic introduction to React concepts"
        }
      },
      {
        id: `${docId}-ch1-2`,
        title: "Why Use React?",
        level: 2,
        parentId: `${docId}-ch1`,
        children: [],
        content: "React offers several advantages: component-based architecture, virtual DOM for performance, strong ecosystem, and excellent developer tools. These features make React an excellent choice for modern web development.",
        metadata: {
          documentName: "React Fundamentals Guide",
          department: 'Engineering' as Department,
          tags: ['react', 'benefits', 'performance'],
          description: "Advantages of using React"
        }
      }
    ],
    content: "This chapter provides a comprehensive introduction to React, covering its core concepts and benefits for modern web development.",
    metadata: {
      documentName: "React Fundamentals Guide",
      department: 'Engineering' as Department,
      tags: ['react', 'introduction'],
      description: "Introduction chapter for React fundamentals"
    }
  },
  {
    id: `${docId}-ch2`,
    title: "Components and JSX",
    level: 1,
    children: [
      {
        id: `${docId}-ch2-1`,
        title: "Creating Components",
        level: 2,
        parentId: `${docId}-ch2`,
        children: [],
        content: "Components are the building blocks of React applications. They can be created as functions or classes. Function components are the modern approach and are preferred for new development.",
        metadata: {
          documentName: "React Fundamentals Guide",
          department: 'Engineering' as Department,
          tags: ['components', 'jsx', 'functions'],
          description: "How to create React components"
        },
        hasChanges: true // Example of version change highlighting
      }
    ],
    content: "Learn about React components and JSX syntax, the foundation of React development.",
    metadata: {
      documentName: "React Fundamentals Guide",
      department: 'Engineering' as Department,
      tags: ['components', 'jsx'],
      description: "Components and JSX fundamentals"
    }
  }
];

const sampleDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'React Fundamentals Guide',
    state: 'published',
    version: 2,
    uploadDate: '2024-01-15',
    lastModified: '2024-01-20',
    fileType: 'pdf',
    chapters: createSampleChapters('doc-1')
  },
  {
    id: 'doc-2',
    name: 'TypeScript Best Practices',
    state: 'draft',
    version: 3,
    uploadDate: '2024-01-22',
    lastModified: '2024-01-25',
    fileType: 'txt',
    chapters: [
      {
        id: 'doc-2-ch1',
        title: "TypeScript Fundamentals",
        level: 1,
        children: [
          {
            id: 'doc-2-ch1-1',
            title: "Type Annotations",
            level: 2,
            parentId: 'doc-2-ch1',
            children: [],
            content: "TypeScript provides static type checking through type annotations. This helps catch errors at compile time rather than runtime.",
            metadata: {
              documentName: "TypeScript Best Practices",
              department: 'Engineering' as Department,
              tags: ['typescript', 'types', 'annotations'],
              description: "Introduction to TypeScript type annotations"
            },
            hasChanges: true // This chapter has changes in the new version
          },
          {
            id: 'doc-2-ch1-2',
            title: "Interface Design",
            level: 2,
            parentId: 'doc-2-ch1',
            children: [],
            content: "Interfaces in TypeScript define the shape of objects and provide a powerful way to define contracts within your code.",
            metadata: {
              documentName: "TypeScript Best Practices",
              department: 'Engineering' as Department,
              tags: ['typescript', 'interfaces', 'contracts'],
              description: "Best practices for designing TypeScript interfaces"
            }
          }
        ],
        content: "This chapter covers the fundamental concepts of TypeScript that every developer should understand.",
        metadata: {
          documentName: "TypeScript Best Practices",
          department: 'Engineering' as Department,
          tags: ['typescript', 'fundamentals'],
          description: "Core TypeScript concepts and fundamentals"
        }
      },
      {
        id: 'doc-2-ch2',
        title: "Advanced Patterns",
        level: 1,
        children: [
          {
            id: 'doc-2-ch2-1',
            title: "Generic Programming",
            level: 2,
            parentId: 'doc-2-ch2',
            children: [],
            content: "Generics provide a way to make components work with any data type and not restrict to one data type.",
            metadata: {
              documentName: "TypeScript Best Practices",
              department: 'Engineering' as Department,
              tags: ['typescript', 'generics', 'advanced'],
              description: "Advanced generic programming techniques"
            },
            hasChanges: true // This chapter also has changes
          }
        ],
        content: "Advanced TypeScript patterns for experienced developers.",
        metadata: {
          documentName: "TypeScript Best Practices",
          department: 'Engineering' as Department,
          tags: ['typescript', 'advanced', 'patterns'],
          description: "Advanced TypeScript programming patterns"
        }
      }
    ]
  },
  {
    id: 'doc-3',
    name: 'API Design Guidelines',
    state: 'published',
    version: 1,
    uploadDate: '2024-01-10',
    lastModified: '2024-01-10',
    fileType: 'pdf',
    chapters: []
  }
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const documentService = {
  async getAllDocuments(): Promise<Document[]> {
    await delay(500);
    return [...sampleDocuments];
  },

  async getDocument(id: string): Promise<Document | null> {
    await delay(300);
    return sampleDocuments.find(doc => doc.id === id) || null;
  },

  async uploadDocument(upload: DocumentUpload): Promise<Document> {
    await delay(500);
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: upload.name,
      state: 'processing',
      version: 1,
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      fileType: upload.file.name.endsWith('.pdf') ? 'pdf' : 'txt',
      chapters: [],
      processingJobId: `job-${Date.now()}`
    };
    sampleDocuments.push(newDoc);
    
    // Simulate processing completion after 5 seconds
    setTimeout(() => {
      const doc = sampleDocuments.find(d => d.id === newDoc.id);
      if (doc && doc.state === 'processing') {
        doc.state = 'draft';
        doc.chapters = createSampleChapters(newDoc.id);
        doc.processingJobId = undefined;
      }
    }, 5000);
    
    return newDoc;
  },

  async uploadDocumentVersion(docId: string, file: File): Promise<Document> {
    await delay(500);
    const docIndex = sampleDocuments.findIndex(doc => doc.id === docId);
    if (docIndex === -1) {
      throw new Error('Document not found');
    }

    const existingDoc = sampleDocuments[docIndex];
    const updatedDoc: Document = {
      ...existingDoc,
      state: 'processing',
      version: existingDoc.version + 1,
      lastModified: new Date().toISOString().split('T')[0],
      chapters: [], // Clear chapters during processing
      processingJobId: `job-${Date.now()}`
    };
    
    sampleDocuments[docIndex] = updatedDoc;
    
    // Simulate processing completion after 5 seconds
    setTimeout(() => {
      const doc = sampleDocuments.find(d => d.id === docId);
      if (doc && doc.state === 'processing') {
        doc.state = 'draft';
        doc.chapters = createSampleChapters(docId);
        doc.processingJobId = undefined;
      }
    }, 5000);
    
    return updatedDoc;
  },

  async updateDocumentMetadata(docId: string, chapterId: string, metadata: any): Promise<void> {
    await delay(200);
    // In a real implementation, this would update the backend
    console.log('Updating metadata:', { docId, chapterId, metadata });
  },

  async publishDocument(docId: string): Promise<Document> {
    await delay(500);
    const doc = sampleDocuments.find(d => d.id === docId);
    if (doc) {
      doc.state = 'published';
      doc.lastModified = new Date().toISOString().split('T')[0];
    }
    return doc!;
  },

  async getChapterContent(chapterId: string): Promise<string> {
    await delay(300);
    // Simulate lazy loading of chapter content
    const allChapters = sampleDocuments.flatMap(doc => 
      this.flattenChapters(doc.chapters)
    );
    const chapter = allChapters.find(ch => ch.id === chapterId);
    return chapter?.content || 'Content not found';
  },

  flattenChapters(chapters: Chapter[]): Chapter[] {
    const result: Chapter[] = [];
    for (const chapter of chapters) {
      result.push(chapter);
      if (chapter.children) {
        result.push(...this.flattenChapters(chapter.children));
      }
    }
    return result;
  }
};