import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../store/documentStore';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import LensSelector from '../components/reading/LensSelector';
import DocumentEditor from '../components/reading/DocumentEditor';
import DocumentHeader from '../components/reading/DocumentHeader';
import { useLens } from '../hooks/useLens';

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocument } = useDocumentStore();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'lenses'>('editor');
  
  const document = id ? getDocument(id) : null;
  
  // Use the lens management hook
  const {
    selectedLens,
    lensContent,
    availableLenses,
    selectLens,
    updateLensContent
  } = useLens(document, 'slide');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading state
  if (id && !document) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Document Error</h2>
          <p className="text-text-secondary font-sans mb-4">
            There was an error processing this document. Please try re-uploading.
          </p>
          <div className="space-x-2">
            <Button onClick={() => navigate('/documents')}>
              Back to Documents
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-border-primary bg-bg-primary sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/documents')}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">Documents</span>
            </Button>
            <div className="h-8 w-px bg-border-primary hidden md:block" />
            <h1 className="font-display text-lg md:text-xl font-semibold text-text-primary truncate max-w-[200px] md:max-w-none">
              {document.title}
            </h1>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Document Header with Formatting Toolbar */}
      <DocumentHeader document={document} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Tabs */}
        {isMobile && (
          <div className="border-b border-border-primary bg-bg-primary sticky top-[112px] z-30">
            <div className="flex">
              <button
                onClick={() => setMobileView('editor')}
                className={`flex-1 px-4 py-3 font-sans text-sm font-medium transition-all duration-normal ease-in-out ${
                  mobileView === 'editor'
                    ? 'text-text-primary border-b-2 border-accent bg-bg-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setMobileView('lenses')}
                className={`flex-1 px-4 py-3 font-sans text-sm font-medium transition-all duration-normal ease-in-out ${
                  mobileView === 'lenses'
                    ? 'text-text-primary border-b-2 border-accent bg-bg-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                Lenses
              </button>
            </div>
          </div>
        )}

        {/* Document Editor - Left Panel */}
        <div 
          className={`flex-1 transition-opacity duration-300 ${
            isMobile && mobileView !== 'editor' ? 'hidden opacity-0' : 'block opacity-100'
          } md:block md:opacity-100`}
        >
          <DocumentEditor 
            document={document}
            selectedLens={selectedLens}
            lensContent={lensContent}
            onContentChange={updateLensContent}
          />
        </div>

        {/* Lens Selector - Right Panel */}
        <div 
          className={`w-full md:w-96 lg:w-[420px] border-l border-border-primary bg-bg-secondary transition-opacity duration-normal ease-in-out ${
            isMobile && mobileView !== 'lenses' ? 'hidden opacity-0' : 'block opacity-100'
          } md:block md:opacity-100`}
        >
          <LensSelector
            selectedLens={selectedLens}
            availableLenses={availableLenses}
            onLensSelect={selectLens}
          />
        </div>
      </div>
    </div>
  );
}