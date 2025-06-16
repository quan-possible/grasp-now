import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { useDocumentStore } from '../store/documentStore';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface DocumentUploadProps {
  folderId?: string;
  onUploadComplete?: (documentIds: string[]) => void;
  showButton?: boolean;
  buttonText?: string;
  className?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  folderId,
  onUploadComplete,
  showButton = true,
  buttonText = 'Upload Documents',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const { uploading } = useDocumentStore();

  const handleUploadComplete = (documentIds: string[]) => {
    // This will be called when files are successfully uploaded
    if (onUploadComplete) {
      onUploadComplete(documentIds);
    }
    
    // Auto-close modal after upload completes
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  const UploadComponent = (
    <UploadZone
      folderId={folderId}
      onUploadComplete={handleUploadComplete}
      className={className}
    />
  );

  if (!showButton) {
    return UploadComponent;
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={uploading}
        className="flex items-center space-x-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span>{buttonText}</span>
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Upload Documents"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Upload your documents to get started. Supported formats include PDF, DOCX, TXT, and Markdown files.
          </p>
          {UploadComponent}
        </div>
      </Modal>
    </>
  );
};

// Compact inline upload zone for use in empty states
export const InlineUpload: React.FC<{ folderId?: string; className?: string }> = ({ 
  folderId, 
  className = '' 
}) => {
  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${className}`}>
      <svg
        className="mx-auto h-8 w-8 text-gray-400 mb-3"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="text-sm font-medium text-gray-900 mb-1">Upload your first document</h3>
      <p className="text-xs text-gray-500 mb-4">Drag and drop files here, or click to browse</p>
      <UploadZone
        folderId={folderId}
        className="border-0 p-0 bg-transparent hover:bg-transparent"
      />
    </div>
  );
};