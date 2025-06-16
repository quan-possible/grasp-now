import React from 'react';
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
  const { getDocument, documents } = useDocumentStore();
  // Mobile responsiveness removed for new layout
  // const [isMobile, setIsMobile] = useState(false);
  // const [mobileView, setMobileView] = useState<'editor' | 'lenses'>('editor');
  
  // Check for placeholder document first
  let document = id ? getDocument(id) : null;
  
  // If document not found in store, check sessionStorage for placeholder
  if (!document && id?.startsWith('placeholder-')) {
    const placeholderData = sessionStorage.getItem(`doc-${id}`);
    if (placeholderData) {
      const placeholder = JSON.parse(placeholderData);
      document = {
        id: placeholder.id,
        title: placeholder.title,
        content: `# ${placeholder.title}\n\nProcessing your document...\n\nFile: ${placeholder.fileName}\nSize: ${(placeholder.fileSize / 1024 / 1024).toFixed(2)} MB\nType: ${placeholder.fileType}\n\n## Content Preview\n\nYour document is being processed. The full content and lenses will be available shortly.`,
        originalFileName: placeholder.fileName,
        fileType: placeholder.fileType,
        fileSize: placeholder.fileSize,
        createdAt: new Date(placeholder.uploadedAt),
        updatedAt: new Date(placeholder.uploadedAt),
        userId: 'temp-user',
        folderId: null,
        tags: [],
        lenses: {
          slide: `# ${placeholder.title} - Slides\n\n## Processing...\n\nGenerating slide view...`,
          study: `# ${placeholder.title} - Study Notes\n\n## Processing...\n\nGenerating study notes...`,
          story: `# ${placeholder.title} - Story\n\n## Processing...\n\nGenerating narrative view...`
        },
        status: 'processing' as const
      };
    }
  }
  
  // Debug logging
  React.useEffect(() => {
    console.log('ReadingPage - Document ID:', id);
    console.log('ReadingPage - Found document:', document);
    console.log('ReadingPage - All documents:', documents);
  }, [id, document, documents]);
  
  // Use the lens management hook
  const {
    selectedLens,
    lensContent,
    availableLenses,
    selectLens,
    updateLensContent
  } = useLens(document, 'slide');

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
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/documents')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-serif text-xl font-normal text-gray-900">
              {document.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              Account Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Document Editor - Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  AI
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Format
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Chat
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Versions
                </Button>
              </div>
            </div>
          </div>
          
          {/* Document Content */}
          <div className="flex-1 overflow-y-auto">
            <DocumentEditor 
              document={document}
              selectedLens={selectedLens}
              lensContent={lensContent}
              onContentChange={updateLensContent}
            />
          </div>
        </div>

        {/* Lens Selector - Right Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
          <LensSelector
            document={document}
            selectedLens={selectedLens}
            availableLenses={availableLenses}
            onLensSelect={selectLens}
          />
        </div>
      </div>
    </div>
  );
}