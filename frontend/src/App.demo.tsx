import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { NavigationSidebar } from './components/NavigationSidebar';
import { DocumentGrid } from './components/DocumentGrid';
import { PromptUploadZone } from './components/PromptUploadZone';
import { Container } from './components/layout/Grid';
import { Button } from './components/ui/Button';

function AppDemo() {
  const [selectedFolder, setSelectedFolder] = useState('recents');

  // Mock user data
  const user = {
    name: 'Demo User',
    displayName: 'Demo User'
  };

  // Mock data for demo
  const mockDocuments = [
    {
      id: '1',
      title: 'Product Strategy 2024',
      content: 'Our comprehensive product strategy for the upcoming year, focusing on user experience improvements and market expansion. This document outlines key initiatives, target markets, and growth objectives.',
      originalFileName: 'product-strategy-2024.pdf',
      fileType: 'application/pdf',
      fileSize: 2457600,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      userId: 'temp-user',
      tags: ['strategy', 'product'],
      status: 'ready' as const,
      lenses: { slide: 'Generated slide content', study: 'Generated study content', story: 'Generated story content' },
      preview: 'Our comprehensive product strategy for the upcoming year, focusing on user experience improvements and market expansion.'
    },
    {
      id: '2',
      title: 'Market Analysis Report',
      content: 'Detailed analysis of current market trends and competitive landscape in the document management space. Includes competitor analysis, market size, and growth opportunities.',
      originalFileName: 'market-analysis.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 1234567,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
      userId: 'temp-user',
      tags: ['research', 'market'],
      status: 'ready' as const,
      lenses: { study: 'Generated study content' },
      preview: 'Detailed analysis of current market trends and competitive landscape in the document management space.'
    },
    {
      id: '3',
      title: 'Team Meeting Notes',
      content: 'Weekly team standup notes covering project updates, blockers, and next steps. Action items and decisions from the product team meeting.',
      originalFileName: 'team-meeting-notes.md',
      fileType: 'text/markdown',
      fileSize: 45678,
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 259200000),
      userId: 'temp-user',
      tags: ['meeting', 'team'],
      status: 'ready' as const,
      lenses: { story: 'Generated story content' },
      preview: 'Weekly team standup notes covering project updates, blockers, and next steps.'
    },
    {
      id: '4',
      title: 'Technical Architecture Doc',
      content: 'System architecture overview for the grasp.now platform, including component diagrams, data flow, and integration points with Firebase and Google Cloud.',
      originalFileName: 'tech-architecture.pdf',
      fileType: 'application/pdf',
      fileSize: 3456789,
      createdAt: new Date(Date.now() - 432000000),
      updatedAt: new Date(Date.now() - 432000000),
      userId: 'temp-user',
      tags: ['architecture', 'technical'],
      status: 'ready' as const,
      lenses: { study: 'Generated study content', slide: 'Generated slide content' },
      preview: 'System architecture overview for the grasp.now platform, including component diagrams, data flow, and integration points.'
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
      id: 'engineering',
      name: 'Engineering'
    },
    {
      id: 'personal',
      name: 'Personal'
    }
  ];

  const handleDocumentClick = (doc: { title: string }) => {
    console.log('Opening document:', doc.title);
    alert(`Opening document: ${doc.title}\n\nThis would open the document viewer with lens options.`);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files.map(f => f.name));
    alert(`Uploading ${files.length} file(s):\n${files.map(f => `• ${f.name}`).join('\n')}\n\nIn the full app, these would be processed and stored in Firebase.`);
  };

  const handlePromptSubmit = (prompt: string) => {
    console.log('Prompt submitted:', prompt);
    alert(`Prompt submitted: "${prompt}"\n\nIn the full app, this would process your request or search through documents.`);
  };

  const handleSignOut = () => {
    alert('Sign out clicked!\n\nIn the full app, this would sign out the user.');
  };

  return (
    <AppLayout
      sidebar={
        <NavigationSidebar
          user={{ name: user.displayName || 'Demo User' }}
          folders={mockFolders}
          activeItem={selectedFolder}
          onFolderSelect={(folderId) => {
            setSelectedFolder(folderId);
            console.log('Selected folder:', folderId);
          }}
          onCreateFolder={() => {
            alert('Create new folder\n\nThis would open a modal to create a new folder.');
          }}
        />
      }
      header={
        <div className="flex-1 flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 ui-text">grasp.now</h1>
            <span className="ml-2 px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-md">
              Demo Mode
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 ui-text">
              Welcome, {user.displayName}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
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

            {/* Upload Zone */}
            <PromptUploadZone
              accept={['.pdf', '.docx', '.txt', '.md']}
              maxSize={10 * 1024 * 1024} // 10MB
              multiple
              onUpload={handleFileUpload}
              onPromptSubmit={handlePromptSubmit}
              placeholder="Ask or find anything from your workspace..."
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
                🚀 Phase 1 Day 3-4: UI Framework Complete
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                ✅ Component library with cards, buttons, modals<br/>
                ✅ NYT-inspired typography system<br/>
                ✅ Responsive grid layouts<br/>
                ✅ Smooth transitions and card shadows<br/>
                ✅ Navigation with sidebar<br/>
                ✅ Document grid and upload zone
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="primary"
                  onClick={() => alert('This would open the upload dialog')}
                >
                  Upload Document
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => alert('This would open the help documentation')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center hover-lift">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Document Upload</h4>
                <p className="text-sm text-gray-600">Drag & drop or click to upload PDF, DOCX, TXT, and MD files</p>
              </div>

              <div className="card p-6 text-center hover-lift">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Lens Transformation</h4>
                <p className="text-sm text-gray-600">Transform documents into Slide, Study, Story, and Scholar formats</p>
              </div>

              <div className="card p-6 text-center hover-lift">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Organization</h4>
                <p className="text-sm text-gray-600">Organize documents in folders with search and filtering</p>
              </div>
            </div>
          </div>
        </Container>
      }
    />
  );
}

export default AppDemo;