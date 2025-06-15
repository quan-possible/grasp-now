import { create } from 'zustand';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  lenses?: {
    slide?: string;
    study?: string;
    story?: string;
  };
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  loading: boolean;
  setDocuments: (documents: Document[]) => void;
  setCurrentDocument: (document: Document | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  setLoading: (loading: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  loading: false,
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
  setLoading: (loading) => set({ loading }),
}));