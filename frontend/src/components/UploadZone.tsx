import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../store/documentStore';
import { validateFiles, DEFAULT_CONFIG, formatFileSize } from '../lib/fileValidation';
import type { FileValidationConfig } from '../lib/fileValidation';

interface UploadZoneProps {
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  onUploadComplete?: (documentIds: string[]) => void;
  folderId?: string;
  className?: string;
  validationConfig?: Partial<FileValidationConfig>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  accept,
  maxSize,
  multiple = true,
  onUpload,
  onUploadComplete,
  folderId,
  className = '',
  validationConfig
}) => {
  const { uploadDocument } = useDocumentStore();
  const navigate = useNavigate();
  
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUploadedDocId, setLastUploadedDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    console.log('handleFiles called with:', files.length, 'files');
    setIsProcessing(true);
    const fileArray = Array.from(files);
    
    // Validate files
    const validationResult = validateFiles(fileArray, config);
    console.log('Validation result:', validationResult);
    
    if (!validationResult.isValid) {
      console.log('Validation failed:', validationResult.error);
      setError(validationResult.error || 'File validation failed');
      setWarnings([]);
      setIsProcessing(false);
      return;
    }
    
    // Clear previous errors and set warnings if any
    setError(null);
    setWarnings(validationResult.warnings || []);
    
    try {
      console.log('=== Starting upload process ===');
      console.log('Files to upload:', fileArray.map(f => f.name));
      
      // Upload each file through the document store
      const documentIds: string[] = [];
      
      for (const file of fileArray) {
        console.log(`Uploading file: ${file.name}`);
        const documentId = await uploadDocument(file, folderId);
        console.log(`File uploaded successfully with ID: ${documentId}`);
        documentIds.push(documentId);
      }
      
      console.log('All files uploaded. Document IDs:', documentIds);
      
      // Store the last uploaded document ID
      if (documentIds.length > 0) {
        setLastUploadedDocId(documentIds[0]);
      }
      
      // Call onUpload if provided (for logging/analytics)
      if (onUpload) {
        onUpload(fileArray);
      }
      
      // Call onUploadComplete with actual document IDs
      console.log('=== About to call onUploadComplete ===');
      console.log('- onUploadComplete exists:', !!onUploadComplete);
      console.log('- documentIds:', documentIds);
      console.log('- onUploadComplete type:', typeof onUploadComplete);
      
      if (onUploadComplete && documentIds.length > 0) {
        console.log('Calling onUploadComplete with document IDs:', documentIds);
        try {
          onUploadComplete(documentIds);
          console.log('onUploadComplete called successfully');
        } catch (error) {
          console.error('Error calling onUploadComplete:', error);
        }
      } else {
        console.log('WARNING: onUploadComplete is not defined or no documents!', { 
          onUploadComplete, 
          type: typeof onUploadComplete,
          documentIds,
          hasDocuments: documentIds.length > 0
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    }
    
    setIsProcessing(false);
  }, [config, onUpload, onUploadComplete, uploadDocument, folderId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    console.log('UploadZone handleDrop triggered');
    console.log('onUploadComplete exists?', !!onUploadComplete);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log('Files dropped:', Array.from(files).map(f => f.name));
      handleFiles(files);
    } else {
      console.log('No files in drop event');
    }
  }, [handleFiles, onUploadComplete]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    console.log('UploadZone clicked, opening file dialog');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const formatFileTypes = (types: string[]) => {
    return types.map(type => type.toUpperCase().replace('.', '')).join(', ');
  };

  // Use the utility function from fileValidation
  // formatFileSize is already imported

  // Upload zone ready with callback

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragOver ? 'border-accent bg-bg-tertiary' : 'border-border-primary hover:border-border-secondary hover:bg-bg-tertiary'}
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
        />

        <div className="space-y-4">
          {isProcessing ? (
            <>
              {/* Processing state */}
              <div className="mx-auto w-12 h-12 text-text-secondary">
                <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-lg font-medium text-text-primary">Processing files...</p>
            </>
          ) : (
            <>
              {/* Upload Icon */}
              <div className="mx-auto w-12 h-12 text-text-tertiary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Upload Text */}
              <div className="space-y-2">
                <p className="text-lg font-medium text-text-primary">
                  Drag & drop your files here
                </p>
                <p className="text-sm text-text-secondary">
                  or{' '}
                  <button
                    type="button"
                    className="text-accent font-medium hover:underline focus:outline-none focus:underline"
                  >
                    click to browse
                  </button>
                </p>
              </div>
            </>
          )}

          {/* File Type Info */}
          <div className="text-xs text-text-tertiary space-y-1">
            <p>Supported formats: {formatFileTypes(config.allowedExtensions)}</p>
            <p>Maximum file size: {formatFileSize(config.maxSize)}</p>
            {config.maxFiles && (
              <p>Maximum {config.maxFiles} files at once</p>
            )}
          </div>
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-error/20 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-error">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-error hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-error"
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
        <div className="p-3 bg-yellow-50 border border-warning/20 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
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
      
      {/* Success Message with Navigation */}
      {lastUploadedDocId && !isProcessing && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Document uploaded successfully!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  console.log('Manual navigation to:', `/document/${lastUploadedDocId}`);
                  navigate(`/document/${lastUploadedDocId}`);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Open Document
              </button>
              <button
                type="button"
                onClick={() => setLastUploadedDocId(null)}
                className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100"
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
      )}
      
    </div>
  );
};