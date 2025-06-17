import { lazy, Suspense, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { DocumentType } from '../../types';
import type { LensType } from '../../lib/lensService';
import { LoadingFallback } from '../LoadingFallback';

// Error boundary for Milkdown editor
class MilkdownErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Milkdown Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Editor Error</h3>
            <p className="text-sm text-gray-600 mb-4">
              There was an issue loading the editor. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
        <MilkdownErrorBoundary>
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
        </MilkdownErrorBoundary>
      </div>
    </div>
  );
}