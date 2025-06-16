import React, { useState } from 'react';

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

interface NavigationSidebarProps {
  user: { name: string; avatar?: string };
  folders: Folder[];
  activeItem?: string;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  user,
  folders,
  activeItem,
  onFolderSelect,
  onCreateFolder
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: Folder, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isActive = activeItem === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id}>
        <div
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
            transition-colors duration-150
            ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
          `}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => onFolderSelect(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="mr-1 p-0.5 rounded hover:bg-gray-200"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-150 ${
                  isExpanded ? 'transform rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          
          <span className="truncate">{folder.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {folder.children!.map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* User section */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 ui-text">
              {user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Quick access */}
        <div className="mb-6">
          <div
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
              transition-colors duration-150
              ${activeItem === 'recents' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
            `}
            onClick={() => onFolderSelect('recents')}
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recents</span>
          </div>

          <div
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
              transition-colors duration-150
              ${activeItem === 'shared' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
            `}
            onClick={() => onFolderSelect('shared')}
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Shared with Me</span>
          </div>
        </div>

        {/* Folders */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider ui-text">
              Folders
            </h3>
            <button
              onClick={onCreateFolder}
              className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              title="Create new folder"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {folders.map(folder => renderFolder(folder))}
          </div>
        </div>
      </div>

      {/* Bottom links */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-200">
        <div className="space-y-1">
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Import
          </a>
          
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
};