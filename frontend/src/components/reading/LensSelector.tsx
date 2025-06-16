import type { DocumentType } from '../../types';
import type { LensType, LensDefinition } from '../../lib/lensService';

interface LensSelectorProps {
  document: DocumentType;
  selectedLens: LensType;
  availableLenses: LensDefinition[];
  onLensSelect: (lens: LensType) => void;
}


// Mock preview content for available lenses
const LENS_PREVIEWS: Record<LensType, string[]> = {
  slide: [
    '• Main Concept Overview',
    '• Key Point 1: Introduction',
    '• Key Point 2: Core Principles',
    '• Key Point 3: Applications',
    '• Summary & Takeaways'
  ],
  study: [
    'Chapter 1: Introduction',
    '  - Definition and context',
    '  - Historical background',
    '  - Key terminology',
    'Chapter 2: Core Concepts',
    '  - Principle A (with examples)',
    '  - Principle B (with diagrams)'
  ],
  story: [
    'THE FUTURE OF LEARNING',
    '',
    'In an era of information overload,',
    'a new approach to document',
    'comprehension emerges...',
    '',
    'Experts say the traditional way',
    'of reading may be obsolete.'
  ],
  scholar: [],
  speed: [],
  faq: []
};

export default function LensSelector({ selectedLens, availableLenses, onLensSelect }: LensSelectorProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-sans text-sm font-medium text-gray-500 uppercase tracking-wide">Available Document Versions</h2>
      </div>

      {/* Lens List */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {availableLenses.map((lens) => {
            return (
              <button
                key={lens.id}
                onClick={() => lens.status === 'available' && onLensSelect(lens.id)}
                disabled={lens.status === 'locked'}
                className={`w-full text-left px-6 py-4 transition-all duration-200 ease-in-out border-l-4 ${
                  selectedLens === lens.id
                    ? 'bg-white border-l-blue-500 shadow-sm'
                    : 'border-l-transparent hover:bg-gray-100'
                } ${
                  lens.status === 'locked' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                <div className="space-y-2">
                  <h3 className="font-sans font-medium text-gray-900 text-sm">
                    {lens.name}
                  </h3>
                  <div className="bg-gray-100 rounded-md p-3">
                    <div className="space-y-1">
                      {LENS_PREVIEWS[lens.id]?.slice(0, 4).map((line, index) => (
                        <div 
                          key={index} 
                          className={`text-xs text-gray-600 ${
                            line === '' ? 'h-2' : ''
                          }`}
                        >
                          {line || '\u00A0'}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  {lens.status === 'locked' && (
                    <div className="text-xs text-gray-400">
                      Coming in Phase {lens.phase}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}