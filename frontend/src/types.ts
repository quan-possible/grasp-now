
// Document type with all fields
export interface DocumentType {
  id: string;
  title: string;
  content: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  storageUrl?: string;
  downloadUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  folderId: string | null;
  tags: string[];
  lenses?: {
    slide?: string;
    study?: string;
    story?: string;
    scholar?: string;
    speed?: string;
    faq?: string;
  };
  status: 'uploading' | 'processing' | 'ready' | 'error';
  preview?: string;
  thumbnail?: string;
}

// Folder type for organizing documents
export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
}

// Upload progress tracking
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}