import React, { useState, useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import type { Document } from '../store/documentStore';
import { DocumentGrid } from './DocumentGrid';
import { DocumentUpload, InlineUpload } from './DocumentUpload';
import { FolderTree } from './FolderTree';
import { FolderBreadcrumb } from './FolderBreadcrumb';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface DocumentManagerProps {
  onDocumentOpen?: (document: Document) => void;
  className?: string;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  onDocumentOpen,
  className = ''
}) => {
  const {
    documents,
    folders,
    loading,
    deleteDocument,
    subscribeToDocuments,
    subscribeToFolders
  } = useDocumentStore();

  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  // Subscribe to real-time updates
  useEffect(() => {
    const userId = 'temp-user'; // TODO: Get from auth store
    
    const unsubscribeDocuments = subscribeToDocuments(userId, currentFolderId);
    const unsubscribeFolders = subscribeToFolders(userId);

    return () => {
      unsubscribeDocuments();
      unsubscribeFolders();
    };
  }, [currentFolderId, subscribeToDocuments, subscribeToFolders]);

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query) ||
      doc.originalFileName.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleDocumentClick = (document: Document) => {
    if (onDocumentOpen) {
      onDocumentOpen(document);
    }
  };

  const handleDocumentDelete = async (document: Document) => {
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      try {
        await deleteDocument(document.id);
        setSelectedDocuments(prev => prev.filter(id => id !== document.id));
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const handleFolderSelect = (folderId?: string) => {
    setCurrentFolderId(folderId);
    setSelectedDocuments([]);
  };

  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : undefined;

  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DocumentUpload
              folderId={currentFolderId}
              buttonText="Upload"
              className="w-full"
            />
          </div>

          {/* Folder Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            <FolderTree
              currentFolderId={currentFolderId}
              onFolderSelect={handleFolderSelect}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {/* Toggle Sidebar Button */}
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              {/* Breadcrumb */}
              <div className="min-w-0 flex-1">
                <FolderBreadcrumb
                  currentFolderId={currentFolderId}
                  onFolderClick={handleFolderSelect}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                  className="w-64 pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors rounded-l-md`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 text-sm ${
                    viewMode === 'list'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors rounded-r-md`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Upload Button (visible when sidebar is hidden) */}
              {!showSidebar && (
                <DocumentUpload
                  folderId={currentFolderId}
                  buttonText="Upload"
                />
              )}
            </div>
          </div>

          {/* Folder info */}
          {currentFolder && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentFolder.name}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {currentFolder.documentCount} document{currentFolder.documentCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <DocumentGrid
              documents={[]}
              viewMode={viewMode}
              onDocumentClick={handleDocumentClick}
              loading={true}
            />
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                // Search results empty state
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No documents match your search query "{searchQuery}".
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty folder state
                <InlineUpload
                  folderId={currentFolderId}
                  className="max-w-md mx-auto"
                />
              )}
            </div>
          ) : (
            <DocumentGrid
              documents={filteredDocuments}
              viewMode={viewMode}
              onDocumentClick={handleDocumentClick}
              onDocumentDelete={handleDocumentDelete}
              selectedDocuments={selectedDocuments}
              onSelectionChange={setSelectedDocuments}
            />
          )}
        </div>
      </div>
    </div>
  );
};