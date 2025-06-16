import React from 'react';
import { useDocumentStore } from '../store/documentStore';
import type { Folder } from '../store/documentStore';

interface FolderBreadcrumbProps {
  currentFolderId?: string;
  onFolderClick: (folderId?: string) => void;
  className?: string;
}

export const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({
  currentFolderId,
  onFolderClick,
  className = ''
}) => {
  const { folders } = useDocumentStore();

  // Build breadcrumb path
  const buildBreadcrumbPath = (folderId?: string): Folder[] => {
    if (!folderId) return [];

    const path: Folder[] = [];
    let currentId: string | undefined = folderId;

    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (!folder) break;
      
      path.unshift(folder);
      currentId = folder.parentId || undefined;
    }

    return path;
  };

  const breadcrumbPath = buildBreadcrumbPath(currentFolderId);

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home/Root */}
      <button
        onClick={() => onFolderClick(undefined)}
        className={`
          flex items-center px-2 py-1 rounded transition-colors
          ${!currentFolderId 
            ? 'text-gray-900 font-medium' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }
        `}
      >
        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        All Documents
      </button>

      {/* Breadcrumb items */}
      {breadcrumbPath.map((folder, index) => {
        const isLast = index === breadcrumbPath.length - 1;
        
        return (
          <React.Fragment key={folder.id}>
            {/* Separator */}
            <svg
              className="h-4 w-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>

            {/* Folder */}
            <button
              onClick={() => onFolderClick(folder.id)}
              className={`
                flex items-center px-2 py-1 rounded transition-colors truncate max-w-xs
                ${isLast 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
              title={folder.name}
            >
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="truncate">{folder.name}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};