import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../store/documentStore';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import LensSelector from '../components/reading/LensSelector';
import DocumentEditor from '../components/reading/DocumentEditor';
import { useLens } from '../hooks/useLens';

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocument, documents, createDemoDocument } = useDocumentStore();
  const [isDragOver, setIsDragOver] = useState(false);
  // Mobile responsiveness removed for new layout
  // const [isMobile, setIsMobile] = useState(false);
  // const [mobileView, setMobileView] = useState<'editor' | 'lenses'>('editor');
  
  // Get document from store
  const document = id ? getDocument(id) : null;
  
  // Debug logging for development
  React.useEffect(() => {
    if (!document && id) {
      console.log('ReadingPage - Document not found:', id);
      console.log('Available documents:', documents.map(d => ({ id: d.id, title: d.title })));
    }
  }, [id, document, documents]);
  
  // Use the lens management hook
  const {
    selectedLens,
    lensContent,
    availableLenses,
    selectLens,
    updateLensContent
  } = useLens(document, 'slide');

  // Drag and drop handlers for creating demo documents
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      console.log('Creating demo document from dropped file:', file.name);
      
      // Create a demo document and navigate to it
      const demoDocument = createDemoDocument(file.name);
      navigate(`/document/${demoDocument.id}`);
    }
  }, [createDemoDocument, navigate]);

  // Mobile detection removed for new layout
  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };
  //   
  //   checkMobile();
  //   window.addEventListener('resize', checkMobile);
  //   return () => window.removeEventListener('resize', checkMobile);
  // }, []);

  // Loading state
  if (id && !document) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <h2 className="text-xl font-display font-semibold text-text-primary mb-2">Loading document...</h2>
          <p className="text-text-secondary font-sans">
            Please wait while we load your document.
          </p>
        </div>
      </div>
    );
  }

  // Document not found
  if (!document) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Document not found</h2>
          <p className="text-text-secondary font-sans mb-4">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/documents')}>
            Back to Documents
          </Button>
        </div>
      </div>
    );
  }

  // Document error state
  if (document.status === 'error') {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Document Error</h2>
          <p className="text-text-secondary font-sans mb-4">
            There was an error processing this document. Please try re-uploading.
          </p>
          <div className="space-x-2">
            <Button onClick={() => navigate('/documents')}>
              Back to Documents
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-bg-page flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay for demo document creation */}
      {isDragOver && (
        <div className="fixed inset-0 bg-accent bg-opacity-20 border-4 border-accent border-dashed z-50 flex items-center justify-center">
          <div className="bg-bg-primary rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Drop file to create demo document</h3>
            <p className="text-text-secondary">Release to create a new document for testing</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border-primary bg-bg-primary sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/documents')}
              className="flex items-center gap-1 text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-display text-xl font-normal text-text-primary">
              {document.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              Account Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center">
        {/* Paper Sheet Container */}
        <div className="flex-1 flex max-w-[1440px] w-full">
          {/* Document Editor - Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="border-b border-border-primary bg-bg-secondary px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                    AI
                  </Button>
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                    Format
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                    Chat
                  </Button>
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                    Versions
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Document Content - Paper Sheet */}
            <div className="flex-1 overflow-y-auto bg-bg-page p-8">
              <div className="paper-sheet mx-auto">
                <DocumentEditor 
                  document={document}
                  selectedLens={selectedLens}
                  lensContent={lensContent}
                  onContentChange={updateLensContent}
                />
              </div>
            </div>
          </div>

          {/* Lens Selector - Right Sidebar */}
          <div className="w-drawer border-l border-border-primary bg-bg-secondary flex flex-col">
            <LensSelector
              document={document}
              selectedLens={selectedLens}
              availableLenses={availableLenses}
              onLensSelect={selectLens}
            />
          </div>
        </div>
      </div>
    </div>
  );
}