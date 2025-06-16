import { useState } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { Login } from './components/Login';
import { AppLayout } from './components/layout/AppLayout';
import { NavigationSidebar } from './components/NavigationSidebar';
import { DocumentGrid } from './components/DocumentGrid';
import { PromptUploadZone } from './components/PromptUploadZone';
import { Container } from './components/layout/Grid';
import { Button } from './components/ui/Button';
import { useAuthStore } from './store/authStore';
import { signOut } from './lib/auth';

function App() {
  const { user, loading } = useAuthStore();
  const [selectedFolder, setSelectedFolder] = useState('recents');

  // Mock data for demo
  const mockDocuments = [
    {
      id: '1',
      title: 'Product Strategy 2024',
      content: 'Our comprehensive product strategy for the upcoming year, focusing on user experience improvements and market expansion.',
      originalFileName: 'product-strategy-2024.pdf',
      fileType: 'application/pdf',
      fileSize: 2457600, // 2.4MB
      createdAt: new Date(Date.now() - 86400000), // Yesterday
      updatedAt: new Date(Date.now() - 86400000),
      userId: 'temp-user',
      folderId: 'strategy',
      tags: ['strategy', 'product'],
      status: 'ready' as const,
      lenses: {
        slide: 'Generated slide content',
        study: 'Generated study content',
        story: 'Generated story content'
      },
      preview: 'Our comprehensive product strategy for the upcoming year, focusing on user experience improvements and market expansion.'
    },
    {
      id: '2',
      title: 'Market Analysis Report',
      content: 'Detailed analysis of current market trends and competitive landscape in the document management space.',
      originalFileName: 'market-analysis.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 1234567, // 1.2MB
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000),
      userId: 'temp-user',
      folderId: 'research',
      tags: ['research', 'market'],
      status: 'ready' as const,
      lenses: {
        study: 'Generated study content',
        story: 'Generated story content'
      },
      preview: 'Detailed analysis of current market trends and competitive landscape in the document management space.'
    }
  ];

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

  const handleDocumentClick = (doc: { title: string }) => {
    console.log('Opening document:', doc.title);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files);
    // TODO: Implement file upload logic
  };

  const handlePromptSubmit = (prompt: string) => {
    console.log('Prompt submitted:', prompt);
    // TODO: Implement prompt processing logic
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      {user ? (
        <AppLayout
          sidebar={
            <NavigationSidebar
              user={{ name: user.displayName || 'User' }}
              folders={mockFolders}
              activeItem={selectedFolder}
              onFolderSelect={setSelectedFolder}
              onCreateFolder={() => console.log('Create folder')}
            />
          }
          header={
            <div className="flex-1 flex items-center justify-between px-6">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 ui-text">grasp.now</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 ui-text">
                  Welcome, {user.displayName}
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
          }
          main={
            <Container size="full" className="py-8">
              <div className="space-y-8">
                {/* Page Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Good afternoon, {user.displayName?.split(' ')[0]}
                  </h2>
                  <p className="text-gray-600">
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Documents
                    </h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>

                  <DocumentGrid
                    documents={mockDocuments}
                    viewMode="grid"
                    onDocumentClick={handleDocumentClick}
                  />
                </div>

                {/* Getting Started */}
                <div className="card p-8 text-center bg-gradient-to-br from-gray-50 to-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    🚀 Phase 1 MVP Implementation Complete
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
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
          }
        />
      ) : (
        <Login />
      )}
    </AuthProvider>
  );
}

export default App
