import { create } from 'zustand';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

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

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

interface DocumentState {
  documents: Document[];
  folders: Folder[];
  currentDocument: Document | null;
  currentFolder: Folder | null;
  loading: boolean;
  uploading: boolean;
  uploadProgress: UploadProgress[];
  
  // Document actions
  setDocuments: (documents: Document[]) => void;
  setCurrentDocument: (document: Document | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => Promise<void>;
  uploadDocument: (file: File, folderId?: string) => Promise<string>;
  
  // Folder actions
  setFolders: (folders: Folder[]) => void;
  setCurrentFolder: (folder: Folder | null) => void;
  createFolder: (name: string, parentId?: string) => Promise<string>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  
  // Loading and progress
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  updateUploadProgress: (fileId: string, progress: Partial<UploadProgress>) => void;
  
  // Data fetching
  fetchDocuments: (folderId?: string) => Promise<void>;
  fetchFolders: (parentId?: string) => Promise<void>;
  subscribeToDocuments: (userId: string, folderId?: string) => () => void;
  subscribeToFolders: (userId: string, parentId?: string) => () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  folders: [],
  currentDocument: null,
  currentFolder: null,
  loading: false,
  uploading: false,
  uploadProgress: [],

  // Document actions
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  addDocument: (document) => set({ documents: [...get().documents, document] }),
  updateDocument: (id, updates) => set({
    documents: get().documents.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ),
    currentDocument: get().currentDocument?.id === id 
      ? { ...get().currentDocument!, ...updates } 
      : get().currentDocument
  }),
  
  deleteDocument: async (id: string) => {
    const document = get().documents.find(doc => doc.id === id);
    if (!document) return;
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', id));
      
      // Delete from Storage if exists
      if (document.storageUrl) {
        const storageRef = ref(storage, document.storageUrl);
        await deleteObject(storageRef);
      }
      
      // Update local state
      set({ 
        documents: get().documents.filter(doc => doc.id !== id),
        currentDocument: get().currentDocument?.id === id ? null : get().currentDocument
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },
  
  uploadDocument: async (file: File, folderId?: string) => {
    const fileId = `${Date.now()}-${file.name}`;
    const userId = 'temp-user'; // TODO: Get from auth store
    
    // Add to upload progress
    set({
      uploading: true,
      uploadProgress: [...get().uploadProgress, {
        file,
        progress: 0,
        status: 'uploading'
      }]
    });
    
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `documents/${userId}/${fileId}`);
      const uploadTask = uploadBytes(storageRef, file);
      
      const snapshot = await uploadTask;
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      // Extract text content (simplified for now)
      const content = await extractTextFromFile(file);
      
      // Create document in Firestore
      const documentData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        content,
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageUrl: snapshot.ref.fullPath,
        downloadUrl,
        userId,
        folderId: folderId || null,
        tags: [],
        status: 'ready' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'documents'), documentData);
      
      // Update progress
      get().updateUploadProgress(fileId, {
        progress: 100,
        status: 'complete'
      });
      
      // Add to local state
      const newDocument: Document = {
        id: docRef.id,
        ...documentData,
        createdAt: documentData.createdAt.toDate(),
        updatedAt: documentData.updatedAt.toDate()
      };
      
      get().addDocument(newDocument);
      
      return docRef.id;
    } catch (error) {
      console.error('Upload error:', error);
      get().updateUploadProgress(fileId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      });
      throw error;
    } finally {
      // Clean up progress after delay
      setTimeout(() => {
        set({
          uploading: false,
          uploadProgress: get().uploadProgress.filter(p => p.file.name !== file.name)
        });
      }, 2000);
    }
  },

  // Folder actions
  setFolders: (folders) => set({ folders }),
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  
  createFolder: async (name: string, parentId?: string) => {
    const userId = 'temp-user'; // TODO: Get from auth store
    
    const folderData = {
      name,
      userId,
      parentId: parentId || null,
      documentCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'folders'), folderData);
    
    const newFolder: Folder = {
      id: docRef.id,
      ...folderData,
      createdAt: folderData.createdAt.toDate(),
      updatedAt: folderData.updatedAt.toDate()
    };
    
    set({ folders: [...get().folders, newFolder] });
    return docRef.id;
  },
  
  updateFolder: async (id: string, updates: Partial<Folder>) => {
    await updateDoc(doc(db, 'folders', id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
    
    set({
      folders: get().folders.map(folder => 
        folder.id === id ? { ...folder, ...updates } : folder
      )
    });
  },
  
  deleteFolder: async (id: string) => {
    await deleteDoc(doc(db, 'folders', id));
    set({ 
      folders: get().folders.filter(folder => folder.id !== id),
      currentFolder: get().currentFolder?.id === id ? null : get().currentFolder
    });
  },

  // Loading and progress
  setLoading: (loading) => set({ loading }),
  setUploading: (uploading) => set({ uploading }),
  updateUploadProgress: (fileId: string, progress: Partial<UploadProgress>) => {
    set({
      uploadProgress: get().uploadProgress.map(p => 
        p.file.name === fileId ? { ...p, ...progress } : p
      )
    });
  },
  
  // Data fetching
  fetchDocuments: async (folderId?: string) => {
    set({ loading: true });
    try {
      const userId = 'temp-user'; // TODO: Get from auth store
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', userId),
        where('folderId', '==', folderId ?? null),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const documents: Document[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Document[];
      
      set({ documents });
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  fetchFolders: async (parentId?: string) => {
    try {
      const userId = 'temp-user'; // TODO: Get from auth store
      const q = query(
        collection(db, 'folders'),
        where('userId', '==', userId),
        where('parentId', '==', parentId ?? null),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const folders: Folder[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Folder[];
      
      set({ folders });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  },
  
  subscribeToDocuments: (userId: string, folderId?: string) => {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      where('folderId', '==', folderId || null),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const documents: Document[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Document[];
      
      set({ documents });
    });
  },
  
  subscribeToFolders: (userId: string, parentId?: string) => {
    const q = query(
      collection(db, 'folders'),
      where('userId', '==', userId),
      where('parentId', '==', parentId || null),
      orderBy('name', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const folders: Folder[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Folder[];
      
      set({ folders });
    });
  }
}));

// Utility function to extract text from files
async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // For now, just handle text files
      // TODO: Add PDF.js for PDF files, mammoth for DOCX
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        resolve(content);
      } else {
        // Placeholder for other file types
        resolve(`Content extracted from ${file.name}`);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For binary files, we'll need specialized libraries
      resolve(`Binary file: ${file.name}`);
    }
  });
}