import { create } from 'zustand';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { DocumentType, Folder, UploadProgress } from '../types';
import { extractTextFromFile } from '../lib/fileExtraction';
import { mockDocuments } from '../lib/mockData';

interface DocumentState {
  documents: DocumentType[];
  folders: Folder[];
  currentDocument: DocumentType | null;
  currentFolder: Folder | null;
  loading: boolean;
  uploading: boolean;
  uploadProgress: UploadProgress[];
  
  // Document actions
  setDocuments: (documents: DocumentType[]) => void;
  setCurrentDocument: (document: DocumentType | null) => void;
  getDocument: (id: string) => DocumentType | null;
  addDocument: (document: DocumentType) => void;
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;
  deleteDocument: (id: string) => Promise<void>;
  uploadDocument: (file: File, folderId?: string) => Promise<string>;
  uploadDocumentWithRedirect: (file: File, onSuccess: (documentId: string) => void, folderId?: string) => Promise<void>;
  
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
  documents: mockDocuments,
  folders: [],
  currentDocument: null,
  currentFolder: null,
  loading: false,
  uploading: false,
  uploadProgress: [],

  // Document actions
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  getDocument: (id: string) => get().documents.find(doc => doc.id === id) || null,
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
      // Extract text content with enhanced placeholder support
      const content = await extractTextFromFile(file);
      
      // Generate placeholder lenses immediately for demo
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const lenses = {
        slide: `# ${fileName} - Key Points\n\n## Main Concepts\n\n- Core idea 1: Essential information\n- Core idea 2: Important details\n- Core idea 3: Key takeaways\n\n## Action Items\n\n- Review content\n- Apply insights\n- Share findings\n\n---\n*Generated slide view*`,
        study: `# ${fileName} - Study Notes\n\n## Overview\n\nDetailed study notes with comprehensive analysis and examples.\n\n## Key Concepts\n\n### Concept 1\nIn-depth explanation with examples and context.\n\n### Concept 2\nComprehensive breakdown with supporting details.\n\n## Practice Questions\n\n1. What are the main points?\n2. How do these concepts apply?\n3. What are the implications?\n\n---\n*Generated study view*`,
        story: `# The Story of ${fileName}\n\nOnce upon a time, there was a document that contained valuable information...\n\n## The Journey\n\nThis document represents a journey of ideas, from conception to completion. Each section builds upon the last, creating a narrative that guides the reader through complex concepts with clarity and purpose.\n\n## The Message\n\nAt its heart, this document tells the story of [key theme], weaving together facts and insights into a compelling narrative that resonates with readers.\n\n## The Conclusion\n\nLike all good stories, this one ends with wisdom gained and knowledge shared.\n\n---\n*Generated story view*`
      };
      
      // Simulate upload progress
      for (let progress = 10; progress <= 100; progress += 20) {
        get().updateUploadProgress(fileId, { progress });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Create document ID
      const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create document in local state (demo mode)
      const newDocument: DocumentType = {
        id: documentId,
        title: fileName,
        content,
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId,
        folderId: folderId || null,
        tags: [],
        lenses,
        status: 'ready' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update progress to complete
      get().updateUploadProgress(fileId, {
        progress: 100,
        status: 'complete'
      });
      
      // Add to local state
      console.log('Adding document to store:', newDocument);
      get().addDocument(newDocument);
      
      // Set as current document for immediate reading
      get().setCurrentDocument(newDocument);
      
      console.log('Document upload complete. ID:', documentId);
      console.log('All documents now:', get().documents.map(d => ({ id: d.id, title: d.title })));
      
      return documentId;
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
      }, 1000);
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
      const documents: DocumentType[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as DocumentType[];
      
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
  
  uploadDocumentWithRedirect: async (file: File, onSuccess: (documentId: string) => void, folderId?: string) => {
    try {
      const documentId = await get().uploadDocument(file, folderId);
      onSuccess(documentId);
    } catch (error) {
      console.error('Upload with redirect failed:', error);
      throw error;
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
      const documents: DocumentType[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as DocumentType[];
      
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

