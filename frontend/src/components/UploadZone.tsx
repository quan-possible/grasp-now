import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { validateFiles, DEFAULT_CONFIG, formatFileSize } from '../lib/fileValidation';
import type { FileValidationConfig } from '../lib/fileValidation';

interface UploadZoneProps {
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  folderId?: string;
  className?: string;
  validationConfig?: Partial<FileValidationConfig>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  accept,
  maxSize,
  multiple = true,
  onUpload,
  folderId,
  className = '',
  validationConfig
}) => {
  const { uploadDocument, uploading, uploadProgress } = useDocumentStore();
  
  // Merge validation config with defaults
  const config: FileValidationConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...validationConfig,
    ...(accept && { allowedExtensions: accept }),
    ...(maxSize && { maxSize })
  }), [validationConfig, accept, maxSize]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validationResult = validateFiles(fileArray, config);
    
    if (!validationResult.isValid) {
      setError(validationResult.error || 'File validation failed');
      setWarnings([]);
      return;
    }
    
    // Clear previous errors and set warnings if any
    setError(null);
    setWarnings(validationResult.warnings || []);
    
    // Use custom onUpload if provided, otherwise use store upload
    if (onUpload) {
      onUpload(fileArray);
    } else {
      // Upload files using document store
      try {
        for (const file of fileArray) {
          await uploadDocument(file, folderId);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setError(error instanceof Error ? error.message : 'Upload failed');
      }
    }
  }, [config, onUpload, uploadDocument, folderId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
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

  const handleClick = useCallback(() => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [uploading]);

  const formatFileTypes = (types: string[]) => {
    return types.map(type => type.toUpperCase().replace('.', '')).join(', ');
  };

  // Use the utility function from fileValidation
  // formatFileSize is already imported

  // Calculate overall progress from uploadProgress array
  const overallProgress = uploadProgress.length > 0 
    ? uploadProgress.reduce((sum, p) => sum + p.progress, 0) / uploadProgress.length
    : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={config.allowedExtensions.join(',')}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-12 h-12 text-gray-400">
            {uploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* Upload Text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Drag & drop your files here'}
            </p>
            <p className="text-sm text-gray-600">
              {uploading ? `${Math.round(overallProgress)}% complete` : (
                <>
                  or{' '}
                  <button
                    type="button"
                    className="text-gray-900 font-medium hover:underline focus:outline-none focus:underline"
                    disabled={uploading}
                  >
                    click to browse
                  </button>
                </>
              )}
            </p>
          </div>

          {/* File Type Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Supported formats: {formatFileTypes(config.allowedExtensions)}</p>
            <p>Maximum file size: {formatFileSize(config.maxSize)}</p>
            {config.maxFiles && (
              <p>Maximum {config.maxFiles} files at once</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Warning Messages */}
      {warnings.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Warnings:</p>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setWarnings([])}
                  className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Progress List */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {progress.status === 'complete' ? (
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : progress.status === 'error' ? (
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-900"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {progress.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(progress.file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {progress.status === 'error' && progress.error && (
                    <span className="text-xs text-red-600">{progress.error}</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {progress.status === 'complete' ? 'Complete' : 
                     progress.status === 'error' ? 'Failed' :
                     `${Math.round(progress.progress)}%`}
                  </span>
                </div>
              </div>
              {progress.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gray-900 h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};