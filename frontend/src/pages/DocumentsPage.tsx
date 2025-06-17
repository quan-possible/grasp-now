import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationSidebar } from '../components/NavigationSidebar';
import { DocumentGrid } from '../components/DocumentGrid';
import { UploadZone } from '../components/UploadZone';
import { Container } from '../components/layout/Grid';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../store/documentStore';
import { signOut } from '../lib/auth';

export default function DocumentsPage() {
  const { user } = useAuthStore();
  const { documents } = useDocumentStore();
  const [selectedFolder, setSelectedFolder] = useState('recents');
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  const mockFolders = [
    {
      id: 'strategy',
      name: 'Strategy',
      children: [
        { id: 'quarterly', name: 'Quarterly Reviews' },
        { id: 'planning', name: 'Planning' }
      ]
    },
    {
      id: 'research',
      name: 'Research'
    },
    {
      id: 'personal',
      name: 'Personal'
    }
  ];

  const handleDocumentClick = (doc: { id: string; title: string }) => {
    navigate(`/document/${doc.id}`);
  };
  
  const handleUploadComplete = useCallback((documentIds: string[]) => {
    console.log('=== handleUploadComplete called ===');
    console.log('Document IDs:', documentIds);
    console.log('Current location:', window.location.pathname);
    console.log('navigate function exists:', !!navigate);
    
    // Navigate to the first uploaded document's reading page
    if (documentIds && documentIds.length > 0) {
      const targetUrl = `/document/${documentIds[0]}`;
      console.log('Will navigate to:', targetUrl);
      
      // Navigate immediately - no delay needed
      console.log('Calling navigate immediately...');
      navigate(targetUrl);
      console.log('Navigation call completed');
    } else {
      console.log('ERROR: No document IDs received');
    }
  }, [navigate]);
  
  // Handle drag and drop on the entire page
  const handlePageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);
  
  const handlePageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only hide drag overlay if we're leaving the main container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);
  
  const handlePageDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    // Page-level drops are now handled by showing the drag overlay only
    // The actual file handling will be done by the UploadZone component
  }, []);


  return (
    <div 
      className="min-h-screen bg-bg-page flex relative"
      onDragOver={handlePageDragOver}
      onDragLeave={handlePageDragLeave}
      onDrop={handlePageDrop}
    >
      {/* Global drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-accent bg-opacity-20 border-4 border-accent border-dashed z-50 flex items-center justify-center">
          <div className="bg-bg-primary rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Drop files to upload</h3>
            <p className="text-text-secondary">Release to upload your documents</p>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <NavigationSidebar
        user={{ name: user?.displayName || 'User' }}
        folders={mockFolders}
        activeItem={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onCreateFolder={() => console.log('Create folder')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-bg-primary border-b border-border-primary">
          <div className="flex-1 flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-display text-text-primary">grasp.now</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary font-sans">
                Welcome, {user?.displayName}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Container size="full" className="py-8">
            <div className="space-y-8">
              {/* Page Header */}
              <div>
                <h2 className="text-2xl font-display text-text-primary mb-2">
                  Good afternoon, {user?.displayName?.split(' ')[0]}
                </h2>
                <p className="text-text-secondary font-sans">
                  Transform your documents with intelligent lenses
                </p>
              </div>

              {/* Simple Upload Zone */}
              <div className="space-y-4" data-upload-zone>
                <UploadZone
                  accept={['.pdf', '.docx', '.txt', '.md']}
                  maxSize={10 * 1024 * 1024}
                  multiple
                  onUploadComplete={handleUploadComplete}
                  validationConfig={{
                    allowedExtensions: ['.pdf', '.docx', '.txt', '.md'],
                    maxSize: 10 * 1024 * 1024
                  }}
                />
              </div>

              {/* Recent Documents */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-sans font-semibold text-text-primary">
                    Recent Documents
                  </h3>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>

                <DocumentGrid
                  documents={documents}
                  viewMode="grid"
                  onDocumentClick={handleDocumentClick}
                />
              </div>

              {/* Getting Started */}
              <div className="card p-8 text-center">
                <h3 className="text-xl font-display font-semibold text-text-primary mb-4">
                  🚀 Phase 1 MVP Implementation Complete
                </h3>
                <p className="text-text-secondary font-sans mb-6 max-w-2xl mx-auto">
                  Core UI framework with NYT-inspired design system, responsive layouts, 
                  and smooth animations. Ready for document management and lens integration.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="primary"
                    onClick={() => {
                      // Trigger the file input in the upload zone
                      const uploadZone = document.querySelector('[data-upload-zone] input[type="file"]') as HTMLInputElement;
                      if (uploadZone) {
                        uploadZone.click();
                      }
                    }}
                  >
                    Upload Document
                  </Button>
                  <Button variant="secondary">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}