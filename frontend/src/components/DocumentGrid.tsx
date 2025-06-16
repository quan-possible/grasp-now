import React from 'react';
import { Card } from './ui/Card';

interface Document {
  id: string;
  title: string;
  preview?: string;
  space?: string;
  thumbnail?: string;
  timestamp?: Date;
  lensTypes?: string[];
}

interface DocumentGridProps {
  documents: Document[];
  viewMode: 'grid' | 'list';
  onDocumentClick: (doc: Document) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

interface DocumentCardProps {
  title: string;
  preview?: string;
  space?: string;
  thumbnail?: string;
  timestamp?: Date;
  lensTypes?: string[];
  onClick?: () => void;
  selected?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  preview,
  space,
  thumbnail,
  timestamp,
  lensTypes = [],
  onClick,
  selected = false
}) => {
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

  return (
    <Card
      hover
      onClick={onClick}
      className={`transition-all duration-200 cursor-pointer ${
        selected ? 'ring-2 ring-gray-900 shadow-card-active' : ''
      }`}
      padding="md"
    >
      <div className="space-y-3">
        {/* Header with title and space */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
            {title}
          </h3>
          {space && (
            <span className="ml-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg flex-shrink-0">
              {space}
            </span>
          )}
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

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {lensTypes.length > 0 && (
              <div className="flex space-x-1">
                {lensTypes.slice(0, 3).map((lens, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg"
                  >
                    {lens}
                  </span>
                ))}
                {lensTypes.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg">
                    +{lensTypes.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {timestamp && (
            <span className="text-xs text-gray-500 ui-text">
              {formatDate(timestamp)}
            </span>
          )}
        </div>
      </div>
    </Card>
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
  loading = false,
  emptyState
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
          title={doc.title}
          preview={doc.preview}
          space={doc.space}
          thumbnail={doc.thumbnail}
          timestamp={doc.timestamp}
          lensTypes={doc.lensTypes}
          onClick={() => onDocumentClick(doc)}
        />
      ))}
    </div>
  );
};