import React from 'react';
import { Document } from '../../types';
import { 
  Presentation, 
  BookOpen, 
  Newspaper, 
  GraduationCap,
  Zap,
  FileQuestion,
  Check
} from 'lucide-react';

interface LensSelectorProps {
  document: Document;
  selectedLens: string;
  onLensSelect: (lens: string) => void;
}

interface LensType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  preview: string;
  status: 'available' | 'generating' | 'locked';
  mockContent?: string[];
}

const lensTypes: LensType[] = [
  {
    id: 'slide',
    name: 'Lecture Slides',
    description: 'Key points in presentation format',
    icon: Presentation,
    preview: 'slide-preview',
    status: 'available',
    mockContent: [
      '• Main Concept Overview',
      '• Key Point 1: Introduction',
      '• Key Point 2: Core Principles',
      '• Key Point 3: Applications',
      '• Summary & Takeaways'
    ]
  },
  {
    id: 'study',
    name: 'Detailed Notes',
    description: 'In-depth study guide with examples',
    icon: BookOpen,
    preview: 'study-preview',
    status: 'available',
    mockContent: [
      'Chapter 1: Introduction',
      '  - Definition and context',
      '  - Historical background',
      '  - Key terminology',
      'Chapter 2: Core Concepts',
      '  - Principle A (with examples)',
      '  - Principle B (with diagrams)'
    ]
  },
  {
    id: 'story',
    name: 'Economist Article',
    description: 'Narrative magazine-style format',
    icon: Newspaper,
    preview: 'story-preview',
    status: 'available',
    mockContent: [
      'THE FUTURE OF LEARNING',
      '',
      'In an era of information overload,',
      'a new approach to document',
      'comprehension emerges...',
      '',
      'Experts say the traditional way',
      'of reading may be obsolete.'
    ]
  },
  {
    id: 'scholar',
    name: 'Academic Outline',
    description: 'Formal academic structure',
    icon: GraduationCap,
    preview: 'scholar-preview',
    status: 'locked',
    mockContent: []
  },
  {
    id: 'speed',
    name: 'Quick Summary',
    description: 'Executive summary format',
    icon: Zap,
    preview: 'speed-preview',
    status: 'locked',
    mockContent: []
  },
  {
    id: 'faq',
    name: 'FAQ Sheet',
    description: 'Questions and answers format',
    icon: FileQuestion,
    preview: 'faq-preview',
    status: 'locked',
    mockContent: []
  }
];

export default function LensSelector({ document, selectedLens, onLensSelect }: LensSelectorProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-border-primary bg-bg-primary">
        <h2 className="font-display text-lg font-semibold text-text-primary">Available Document Versions</h2>
        <p className="text-sm text-text-secondary font-sans mt-1">
          Select a lens to transform your document
        </p>
      </div>

      {/* Lens Cards */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="space-y-4">
          {lensTypes.map((lens) => (
            <button
              key={lens.id}
              onClick={() => lens.status === 'available' && onLensSelect(lens.id)}
              disabled={lens.status === 'locked'}
              className={`w-full text-left transition-all duration-normal ease ${
                lens.status === 'locked' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg hover:-translate-y-0.5 active:shadow-md active:scale-[0.98]'
              }`}
            >
              <div 
                className={`bg-bg-primary rounded-xl border p-4 transition-all duration-fast ease ${
                  selectedLens === lens.id 
                    ? 'border-accent shadow-lg ring-2 ring-accent ring-opacity-20' 
                    : 'border-border-primary shadow-md'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-fast ease ${
                      selectedLens === lens.id ? 'bg-accent' : 'bg-bg-tertiary'
                    }`}>
                      <lens.icon className={`w-5 h-5 ${
                        selectedLens === lens.id ? 'text-white' : 'text-text-secondary'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-sm text-text-primary">
                        {lens.name}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {lens.description}
                      </p>
                    </div>
                  </div>
                  {lens.status === 'available' && selectedLens === lens.id && (
                    <Check className="w-5 h-5 text-success" />
                  )}
                </div>

                {/* Preview */}
                {lens.status === 'available' && (
                  <div className="mt-3 p-3 bg-bg-tertiary rounded-lg border border-border-primary">
                    <div className="space-y-1">
                      {lens.mockContent?.slice(0, 4).map((line, index) => (
                        <div 
                          key={index} 
                          className={`text-xs text-text-secondary font-mono ${
                            line === '' ? 'h-2' : ''
                          }`}
                        >
                          {line || '\u00A0'}
                        </div>
                      ))}
                      {lens.mockContent && lens.mockContent.length > 4 && (
                        <div className="text-xs text-text-tertiary font-mono">...</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                {lens.status === 'locked' && (
                  <div className="mt-3 px-3 py-2 bg-bg-tertiary rounded-lg text-xs text-text-tertiary font-sans text-center">
                    Coming in Phase 2
                  </div>
                )}

                {lens.status === 'generating' && (
                  <div className="mt-3 px-3 py-2 bg-tag-teal rounded-lg text-xs text-accent font-sans text-center">
                    Generating lens...
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-tag-teal rounded-xl border border-border-primary">
          <div className="flex gap-3">
            <div className="text-accent mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-sans text-text-primary">
                <span className="font-semibold">Tip:</span> Each lens presents your document 
                in a different format optimized for specific learning needs. Try switching 
                between lenses to find the best view for your current task.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}