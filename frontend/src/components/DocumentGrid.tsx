import React, { useState } from 'react';
import { Card } from './ui/Card';
import type { DocumentType } from '../types';
import { formatFileSize, getFileTypeFromExtension } from '../lib/fileValidation';

interface DocumentGridProps {
  documents: DocumentType[];
  viewMode: 'grid' | 'list';
  onDocumentClick: (doc: DocumentType) => void;
  onDocumentDelete?: (doc: DocumentType) => void;
  onDocumentEdit?: (doc: DocumentType) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  selectedDocuments?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

interface DocumentCardProps {
  document: DocumentType;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  selected?: boolean;
  showActions?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onClick,
  onDelete,
  onEdit,
  selected = false,
  showActions = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    title, 
    preview, 
    thumbnail, 
    createdAt, 
    updatedAt, 
    lenses, 
    fileSize, 
    originalFileName, 
    status,
    tags
  } = document;
  
  const lensTypes = lenses ? Object.keys(lenses).filter(key => lenses[key as keyof typeof lenses]) : [];
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  const getStatusColor = (status: DocumentType['status']) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'uploading': return 'text-blue-600 bg-blue-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`transition-all duration-200 cursor-pointer group relative ${
        selected ? 'ring-2 ring-gray-900 shadow-card-active' : ''
      } ${
        isHovered ? 'shadow-lg scale-[1.02] border-gray-300' : ''
      }`}
    >
      <Card
        hover
        className="h-full"
        padding="md"
      >
        <div className="space-y-3">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {getFileTypeFromExtension(originalFileName)} • {formatFileSize(fileSize)}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            
            {/* Action Menu */}
            {showActions && isHovered && (
              <div className="flex space-x-1">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Edit document"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete document"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview text */}
        {preview && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {preview}
          </p>
        )}

        {/* Thumbnail if available */}
        {thumbnail && (
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={thumbnail}
              alt={`${title} preview`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {lensTypes.length > 0 && (
              <div className="flex space-x-1">
                {lensTypes.slice(0, 3).map((lens, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg"
                  >
                    {lens.charAt(0).toUpperCase() + lens.slice(1)}
                  </span>
                ))}
                {lensTypes.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg">
                    +{lensTypes.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {formatDate(updatedAt)}
            </div>
            {createdAt.getTime() !== updatedAt.getTime() && (
              <div className="text-xs text-gray-400">
                Created {formatDate(createdAt)}
              </div>
            )}
          </div>
        </div>
        </div>
      </Card>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <Card padding="md">
    <div className="animate-pulse space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="flex space-x-2">
          <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  </Card>
);

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  viewMode,
  onDocumentClick,
  onDocumentDelete,
  onDocumentEdit,
  loading = false,
  emptyState,
  selectedDocuments = []
}) => {
  if (loading) {
    return (
      <div className={`
        grid gap-4
        ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}
      `}>
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (documents.length === 0 && emptyState) {
    return <div>{emptyState}</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
      </div>
    );
  }

  return (
    <div className={`
      grid gap-4
      ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}
    `}>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          selected={selectedDocuments.includes(doc.id)}
          onClick={() => onDocumentClick(doc)}
          onDelete={onDocumentDelete ? () => onDocumentDelete(doc) : undefined}
          onEdit={onDocumentEdit ? () => onDocumentEdit(doc) : undefined}
        />
      ))}
    </div>
  );
};