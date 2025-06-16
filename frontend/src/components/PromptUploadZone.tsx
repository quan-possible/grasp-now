import React, { useState, useRef, useCallback } from 'react';
import { Card } from './ui/Card';

interface PromptUploadZoneProps {
  accept: string[];
  maxSize: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  onPromptSubmit: (prompt: string) => void;
  uploading?: boolean;
  progress?: number;
  placeholder?: string;
}

export const PromptUploadZone: React.FC<PromptUploadZoneProps> = ({
  accept,
  maxSize,
  multiple = false,
  onUpload,
  onPromptSubmit,
  uploading = false,
  progress = 0,
  placeholder = "Ask or find anything from your workspace..."
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [focusMode, setFocusMode] = useState<'prompt' | 'upload' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!accept.includes(extension)) {
      return `File type not supported. Accepted types: ${accept.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    
    return null;
  }, [accept, maxSize]);

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }
      validFiles.push(file);
    }
    
    setError(null);
    onUpload(validFiles);
  }, [onUpload, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    setFocusMode('upload');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setFocusMode(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setFocusMode(null);
    
    if (uploading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [uploading, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleUploadClick = useCallback(() => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [uploading]);

  const handlePromptSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
      setFocusMode(null);
    }
  }, [prompt, onPromptSubmit]);

  const handleTextareaFocus = useCallback(() => {
    setFocusMode('prompt');
  }, []);

  const handleTextareaBlur = useCallback(() => {
    if (!prompt.trim()) {
      setFocusMode(null);
    }
  }, [prompt]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  const formatFileTypes = (types: string[]) => {
    return types.map(type => type.toUpperCase().replace('.', '')).join(', ');
  };

  const isUploadMode = focusMode === 'upload' || isDragOver;
  // const isPromptMode = focusMode === 'prompt' || prompt.trim();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="relative">
        <div
          className="relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept.join(',')}
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />

          {/* Drag and Drop Area - Extended Upper Section */}
          {(isUploadMode || isDragOver) && (
            <div className={`
              mb-2 p-6 border-2 border-dashed rounded-lg transition-all duration-200 ease-out cursor-pointer
              ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={!uploading ? handleUploadClick : undefined}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {uploading ? 'Uploading files...' : (isDragOver ? 'Drop files to upload' : 'Drag & drop files here')}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {uploading ? `${Math.round(progress)}% complete` : `${formatFileTypes(accept)} • Max ${Math.round(maxSize / (1024 * 1024))}MB`}
                </p>
                
                {!uploading && (
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Or click to browse
                  </button>
                )}

                {/* Progress Bar */}
                {uploading && (
                  <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Prompt Input Box - Always Visible Like Notion */}
          <form onSubmit={handlePromptSubmit} className="relative">
            <div className={`
              flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm
              hover:shadow-md transition-all duration-200 ease-out
              ${focusMode === 'prompt' ? 'border-blue-300 shadow-md' : ''}
              ${uploading ? 'opacity-50' : ''}
            `}>
              {/* Avatar/Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Text Input */}
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={handleTextareaChange}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                  placeholder={placeholder}
                  className="w-full resize-none border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-sm leading-5 font-normal"
                  rows={1}
                  style={{ minHeight: '20px', maxHeight: '200px' }}
                  disabled={uploading}
                />
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-2">
                {/* Upload button hint */}
                <button
                  type="button"
                  onClick={() => setFocusMode('upload')}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Upload files"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Submit Button */}
                {prompt.trim() && (
                  <button
                    type="submit"
                    disabled={!prompt.trim() || uploading}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-50 border border-red-200" padding="sm">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};