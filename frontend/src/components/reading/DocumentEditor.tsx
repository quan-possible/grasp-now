import React from 'react';
import { Document } from '../../types';
import { LensType } from '../../lib/lensService';
import MilkdownEditor from '../MilkdownEditor';

interface DocumentEditorProps {
  document: Document;
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
    <div className="h-full bg-bg-primary">
      <div className="h-full">
        <MilkdownEditor
          key={`${document.id}-${selectedLens}`} // Force re-render on lens change
          initialMarkdown={lensContent}
          onMarkdownChange={handleMarkdownChange}
          placeholder={`Type / for commands, or start editing the ${selectedLens} lens...`}
          className="h-full"
        />
      </div>
    </div>
  );
}