import React, { useRef, useEffect } from 'react';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

// Import Crepe themes and styles
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import './styles/milkdown-custom.css';

interface MilkdownEditorProps {
  initialMarkdown?: string;
  onMarkdownChange?: (markdown: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  mode?: 'wysiwyg' | 'source';
}

// Inner component that uses the useEditor hook
const CrepeEditorInner: React.FC<MilkdownEditorProps & { onReady?: () => void }> = ({
  initialMarkdown = '',
  onMarkdownChange,
  readOnly = false,
  placeholder = 'Type / for commands, or start writing...',
  onReady,
}) => {
  const crepeRef = useRef<Crepe | null>(null);

  const { loading } = useEditor((root) => {
    console.log('Creating Crepe editor with useEditor hook...');
    
    const crepe = new Crepe({
      root,
      defaultValue: initialMarkdown,
      features: {
        [Crepe.Feature.CodeMirror]: true,
        [Crepe.Feature.ListItem]: true,
        [Crepe.Feature.LinkTooltip]: true,
        [Crepe.Feature.ImageBlock]: true,
        [Crepe.Feature.BlockEdit]: true,
        [Crepe.Feature.Table]: true,
        [Crepe.Feature.Toolbar]: true,
        [Crepe.Feature.Cursor]: true,
        [Crepe.Feature.Placeholder]: true,
        [Crepe.Feature.Latex]: true,
      },
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: placeholder,
        },
        [Crepe.Feature.LinkTooltip]: {
          inputPlaceholder: 'Enter URL...',
        },
        [Crepe.Feature.ImageBlock]: {
          onUpload: async (file: File) => {
            console.log('Uploading file:', file.name);
            return URL.createObjectURL(file);
          },
        },
      },
    });

    // Set up content change listener
    if (onMarkdownChange) {
      crepe.editor.use(listener);
      crepe.editor.config((ctx) => {
        const listenerCtxInstance = ctx.get(listenerCtx);
        listenerCtxInstance.markdownUpdated((_, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            onMarkdownChange(markdown);
          }
        });
      });
    }

    crepeRef.current = crepe;
    
    return crepe;
  });

  // Handle ready state
  useEffect(() => {
    if (!loading && onReady) {
      onReady();
    }
  }, [loading, onReady]);

  // Handle read-only mode
  useEffect(() => {
    if (crepeRef.current && !loading) {
      crepeRef.current.setReadonly(readOnly);
    }
  }, [readOnly, loading]);

  return <Milkdown />;
};

// Main component with provider
export const MilkdownEditor: React.FC<MilkdownEditorProps> = (props) => {
  const { className = '', mode = 'wysiwyg' } = props;
  
  // Note: mode parameter is prepared for future implementation of source mode
  console.debug('Editor mode:', mode);

  return (
    <div className={`milkdown-wrapper ${className}`}>
      <MilkdownProvider>
        <CrepeEditorInner {...props} />
      </MilkdownProvider>
    </div>
  );
};

export default MilkdownEditor;