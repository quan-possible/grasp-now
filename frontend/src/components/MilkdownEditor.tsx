import React, { useEffect } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { history } from '@milkdown/kit/plugin/history';
import { gfm } from '@milkdown/kit/preset/gfm';
// Note: Removed theme-nord to avoid CSS conflicts with Tailwind
// Milkdown v7 is headless by design, so we'll use custom styling instead

// Import custom styles
import './styles/milkdown-custom.css';

interface MilkdownEditorProps {
  initialMarkdown?: string;
  onMarkdownChange?: (markdown: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  mode?: 'wysiwyg' | 'source';
}

const MilkdownEditorInner: React.FC<MilkdownEditorProps> = ({
  initialMarkdown = '',
  onMarkdownChange,
  readOnly = false,
  placeholder = 'Type / for commands, or start writing...',
  className = '',
  mode = 'wysiwyg'
}) => {
  console.debug('Editor mode:', mode, 'readOnly:', readOnly, 'initialMarkdown:', initialMarkdown, 'placeholder:', placeholder);

  const { get, loading } = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialMarkdown);
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener);
  }, [initialMarkdown]);

  useEffect(() => {
    if (!loading && onMarkdownChange) {
      const editor = get();
      if (editor) {
        editor.ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            onMarkdownChange(markdown);
          }
        });
      }
    }
  }, [loading, get, onMarkdownChange]);

  return (
    <div className={`milkdown-wrapper ${className}`}>
      <Milkdown />
    </div>
  );
};

const MilkdownEditor: React.FC<MilkdownEditorProps> = (props) => {
  return (
    <MilkdownProvider>
      <MilkdownEditorInner {...props} />
    </MilkdownProvider>
  );
};

export default MilkdownEditor;