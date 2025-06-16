import React, { useState, useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import type { Folder } from '../store/documentStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';

interface FolderTreeProps {
  currentFolderId?: string;
  onFolderSelect: (folderId: string | undefined) => void;
  onFolderCreate?: (name: string, parentId?: string) => void;
  onFolderDelete?: (folderId: string) => void;
  onFolderRename?: (folderId: string, newName: string) => void;
  className?: string;
}

interface FolderItemProps {
  folder: Folder;
  level: number;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  onEdit?: (folderId: string) => void;
  onDelete?: (folderId: string) => void;
  onCreateSubfolder?: (parentId: string) => void;
  children?: React.ReactNode;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  level,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onCreateSubfolder,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const paddingLeft = level * 16; // 16px per level

  return (
    <div>
      <div
        className={`
          group flex items-center py-2 px-3 text-sm cursor-pointer rounded-lg transition-colors
          ${isSelected ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}
        `}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onClick={() => onSelect(folder.id)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Expand/Collapse Icon */}
        {children && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mr-1 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Folder Icon */}
        <svg
          className={`h-4 w-4 mr-2 flex-shrink-0 ${
            isSelected ? 'text-gray-700' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>

        {/* Folder Name */}
        <span className="flex-1 truncate">{folder.name}</span>

        {/* Document Count */}
        {folder.documentCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
            {folder.documentCount}
          </span>
        )}

        {/* Actions */}
        {showActions && (
          <div className="ml-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onCreateSubfolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateSubfolder(folder.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title="Create subfolder"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(folder.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title="Rename folder"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete folder"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {isExpanded && children && (
        <div className="mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  currentFolderId,
  onFolderSelect,
  onFolderCreate,
  onFolderDelete,
  onFolderRename,
  className = ''
}) => {
  const { folders, fetchFolders, createFolder, updateFolder, deleteFolder } = useDocumentStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | undefined>();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameFolder, setRenameFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Build folder tree structure
  const buildFolderTree = (parentId?: string): Folder[] => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName.trim(), createParentId);
      if (onFolderCreate) {
        onFolderCreate(newFolderName.trim(), createParentId);
      }
      setShowCreateModal(false);
      setNewFolderName('');
      setCreateParentId(undefined);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleRenameFolder = async () => {
    if (!renameFolder || !newFolderName.trim()) return;

    try {
      await updateFolder(renameFolder.id, { name: newFolderName.trim() });
      if (onFolderRename) {
        onFolderRename(renameFolder.id, newFolderName.trim());
      }
      setShowRenameModal(false);
      setRenameFolder(null);
      setNewFolderName('');
    } catch (error) {
      console.error('Failed to rename folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    if (folder.documentCount > 0) {
      if (!confirm(`Folder "${folder.name}" contains ${folder.documentCount} documents. Are you sure you want to delete it?`)) {
        return;
      }
    }

    try {
      await deleteFolder(folderId);
      if (onFolderDelete) {
        onFolderDelete(folderId);
      }
      // If we're currently in the deleted folder, go to root
      if (currentFolderId === folderId) {
        onFolderSelect(undefined);
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const renderFolderTree = (parentId?: string, level: number = 0): React.ReactNode => {
    const folders = buildFolderTree(parentId);
    
    return folders.map(folder => {
      const hasChildren = buildFolderTree(folder.id).length > 0;
      
      return (
        <FolderItem
          key={folder.id}
          folder={folder}
          level={level}
          isSelected={currentFolderId === folder.id}
          onSelect={() => onFolderSelect(folder.id)}
          onEdit={(folderId) => {
            const folder = folders.find(f => f.id === folderId);
            if (folder) {
              setRenameFolder(folder);
              setNewFolderName(folder.name);
              setShowRenameModal(true);
            }
          }}
          onDelete={handleDeleteFolder}
          onCreateSubfolder={(parentId) => {
            setCreateParentId(parentId);
            setShowCreateModal(true);
          }}
        >
          {hasChildren && renderFolderTree(folder.id, level + 1)}
        </FolderItem>
      );
    });
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Root folder */}
      <div
        className={`
          flex items-center py-2 px-3 text-sm cursor-pointer rounded-lg transition-colors
          ${!currentFolderId ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}
        `}
        onClick={() => onFolderSelect(undefined)}
      >
        <svg
          className={`h-4 w-4 mr-2 flex-shrink-0 ${
            !currentFolderId ? 'text-gray-700' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <span className="flex-1">All Documents</span>
      </div>

      {/* Folder tree */}
      {renderFolderTree()}

      {/* Create folder button */}
      <div className="pt-2 border-t border-gray-200">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setCreateParentId(undefined);
            setShowCreateModal(true);
          }}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Folder
        </Button>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewFolderName('');
          setCreateParentId(undefined);
        }}
        title="Create New Folder"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <Input
              value={newFolderName}
              onChange={(value) => setNewFolderName(value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
              autoFocus
            />
          </div>
          {createParentId && (
            <p className="text-sm text-gray-600">
              Creating subfolder in "{folders.find(f => f.id === createParentId)?.name}"
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setNewFolderName('');
                setCreateParentId(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Folder Modal */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setRenameFolder(null);
          setNewFolderName('');
        }}
        title="Rename Folder"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <Input
              value={newFolderName}
              onChange={(value) => setNewFolderName(value)}
              placeholder="Enter new folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameFolder();
                }
              }}
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRenameModal(false);
                setRenameFolder(null);
                setNewFolderName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameFolder}
              disabled={!newFolderName.trim() || newFolderName === renameFolder?.name}
            >
              Rename
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};