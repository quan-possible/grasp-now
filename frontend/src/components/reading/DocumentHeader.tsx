import React from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link2,
  Heading1,
  Heading2,
  Heading3,
  Type
} from 'lucide-react';
import { Document } from '../../types';

interface DocumentHeaderProps {
  document: Document;
}

export default function DocumentHeader({}: DocumentHeaderProps) {
  const formatButtons = [
    { icon: Bold, label: 'Bold', shortcut: '⌘B' },
    { icon: Italic, label: 'Italic', shortcut: '⌘I' },
    { icon: Heading1, label: 'Heading 1' },
    { icon: Heading2, label: 'Heading 2' },
    { icon: Heading3, label: 'Heading 3' },
    { icon: Type, label: 'Text' },
    { icon: List, label: 'Bullet List' },
    { icon: ListOrdered, label: 'Numbered List' },
    { icon: Quote, label: 'Quote' },
    { icon: Code, label: 'Code' },
    { icon: Link2, label: 'Link', shortcut: '⌘K' },
  ];

  return (
    <div className="border-b border-border-primary bg-bg-primary sticky top-16 z-30">
      <div className="px-4 md:px-6 py-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              className="p-2 rounded-lg hover:bg-bg-tertiary transition-all duration-fast ease-in-out group relative active:scale-95"
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            >
              <button.icon className="w-4 h-4 text-text-secondary group-hover:text-text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}