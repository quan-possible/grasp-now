import { lazy, Suspense } from 'react';
import type { DocumentType } from '../../types';
import type { LensType } from '../../lib/lensService';
import { LoadingFallback } from '../LoadingFallback';

// Lazy load the heavy MilkdownEditor component
const MilkdownEditor = lazy(() => import('../MilkdownEditor'));

interface DocumentEditorProps {
  document: DocumentType;
  selectedLens: LensType;
  lensContent: string;
  onContentChange: (content: string) => void;
}

export default function DocumentEditor({ 
  document, 
  selectedLens, 
  lensContent,
  onContentChange 
}: DocumentEditorProps) {
  const handleMarkdownChange = (newMarkdown: string) => {
    onContentChange(newMarkdown);
  };

  return (
    <div className="h-full bg-white">
      <div className="max-w-4xl mx-auto px-8 py-8 h-full">
        <Suspense fallback={
          <LoadingFallback message="Loading editor..." size="md" className="h-full" />
        }>
          <MilkdownEditor
            key={`${document.id}-${selectedLens}`} // Force re-render on lens change
            initialMarkdown={lensContent}
            onMarkdownChange={handleMarkdownChange}
            placeholder={`Type / for commands, or start editing the ${selectedLens} lens...`}
            className="h-full prose prose-lg max-w-none"
          />
        </Suspense>
      </div>
    </div>
  );
}