import React, { useState, useEffect, useCallback } from 'react';
import MilkdownEditor from './MilkdownEditor';
import { Button } from './ui/Button';
import { useDocumentStore } from '../store/documentStore';
import type { DocumentType } from '../types';

interface StandaloneEditorProps {
  document: DocumentType;
  onClose: () => void;
  className?: string;
}

export const StandaloneEditor: React.FC<StandaloneEditorProps> = ({
  document,
  onClose,
  className = '',
}) => {
  const [content, setContent] = useState(document.content);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { updateDocument } = useDocumentStore();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== document.content);
  };

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await updateDocument(document.id, {
        content,
        updatedAt: new Date(),
      });
      setHasChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, content, document.id, updateDocument]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasChanges) return;

    const timer = setTimeout(async () => {
      await handleSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, hasChanges, handleSave]);

  const handleExport = () => {
    // Create a downloadable file with the markdown content
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {document.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  {isSaving ? 'Saving...' : hasChanges ? 'Unsaved changes' : 'Saved'}
                </span>
                {lastSaved && (
                  <>
                    <span>•</span>
                    <span>
                      Last saved {lastSaved.toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="text-gray-600 hover:text-gray-800"
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MilkdownEditor
          initialMarkdown={content}
          onMarkdownChange={handleContentChange}
          placeholder="Start writing your document..."
          className="h-full"
        />
      </div>
    </div>
  );
};

export default StandaloneEditor;