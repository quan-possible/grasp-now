import React, { useState } from 'react';
import { NavigationSidebar } from '../components/NavigationSidebar';
import { DocumentGrid } from '../components/DocumentGrid';
import { PromptUploadZone } from '../components/PromptUploadZone';
import { Container } from '../components/layout/Grid';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../store/documentStore';
import { signOut } from '../lib/auth';

export default function DocumentsPage() {
  const { user } = useAuthStore();
  const { documents } = useDocumentStore();
  const [selectedFolder, setSelectedFolder] = useState('recents');

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
    window.location.href = `/document/${doc.id}`;
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files);
    // TODO: Implement file upload logic
  };

  const handlePromptSubmit = (prompt: string) => {
    console.log('Prompt submitted:', prompt);
    // TODO: Implement prompt processing logic
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
        <header className="bg-white border-b border-gray-200">
          <div className="flex-1 flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-cheltenham text-gray-900">grasp.now</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-franklin">
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
                <h2 className="text-2xl font-cheltenham text-gray-900 mb-2">
                  Good afternoon, {user?.displayName?.split(' ')[0]}
                </h2>
                <p className="text-gray-600 font-franklin">
                  Transform your documents with intelligent lenses
                </p>
              </div>

              {/* Prompt Upload Zone */}
              <PromptUploadZone
                accept={['.pdf', '.docx', '.txt', '.md']}
                maxSize={10 * 1024 * 1024} // 10MB
                multiple
                onUpload={handleFileUpload}
                onPromptSubmit={handlePromptSubmit}
                placeholder="Ask questions about your documents or drag & drop files to upload..."
              />

              {/* Recent Documents */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-franklin font-semibold text-gray-900">
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
              <div className="card p-8 text-center bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-xl font-cheltenham font-semibold text-gray-900 mb-4">
                  🚀 Phase 1 MVP Implementation Complete
                </h3>
                <p className="text-gray-600 font-franklin mb-6 max-w-2xl mx-auto">
                  Core UI framework with NYT-inspired design system, responsive layouts, 
                  and smooth animations. Ready for document management and lens integration.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="primary">
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