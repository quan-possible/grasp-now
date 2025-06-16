import React, { useEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';

export const SimpleMilkdownEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    console.log('Creating simple Milkdown editor...');
    
    try {
      const crepe = new Crepe({
        root: editorRef.current,
        defaultValue: '# Hello Milkdown\n\nThis is a test.',
      });

      crepe.create().then(() => {
        console.log('Simple editor created successfully');
        crepeRef.current = crepe;
      }).catch((error) => {
        console.error('Failed to create simple editor:', error);
      });

      return () => {
        if (crepeRef.current) {
          crepeRef.current.destroy();
        }
      };
    } catch (error) {
      console.error('Failed to initialize simple editor:', error);
    }
  }, []);

  return (
    <div className="simple-milkdown-wrapper" style={{ height: '400px', border: '1px solid #ccc' }}>
      <div ref={editorRef} />
    </div>
  );
};

export default SimpleMilkdownEditor;