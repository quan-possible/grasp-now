export interface Document {
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
  };
  status: 'uploading' | 'processing' | 'ready' | 'error';
  preview?: string;
  thumbnail?: string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
}