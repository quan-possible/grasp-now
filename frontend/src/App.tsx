import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { Login } from './components/Login';
import { LoadingFallback } from './components/LoadingFallback';
import { useAuthStore } from './store/authStore';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load heavy pages to reduce initial bundle size
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const ReadingPage = lazy(() => import('./pages/ReadingPage'));

function App() {
  const { user, loading } = useAuthStore();
  
  // Prevent default drag and drop behavior globally to avoid file opening
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handleDrop = (e: Event) => {
      const dragEvent = e as DragEvent;
      dragEvent.preventDefault();
      dragEvent.stopPropagation();
      console.log('Global drop event prevented');
      // Don't handle files here - let our components handle them
    };
    
    const handleDragOver = (e: Event) => {
      const dragEvent = e as DragEvent;
      dragEvent.preventDefault();
      dragEvent.stopPropagation();
      // Set drop effect to copy to show the proper cursor
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.dropEffect = 'copy';
      }
    };
    
    // Prevent default drag behaviors on all events
    ['dragenter', 'dragleave'].forEach(eventName => {
      document.addEventListener(eventName, preventDefaults as EventListener, false);
    });
    
    // Special handling for dragover and drop
    document.addEventListener('dragover', handleDragOver as EventListener, false);
    document.addEventListener('drop', handleDrop as EventListener, false);
    
    return () => {
      ['dragenter', 'dragleave'].forEach(eventName => {
        document.removeEventListener(eventName, preventDefaults as EventListener, false);
      });
      document.removeEventListener('dragover', handleDragOver as EventListener, false);
      document.removeEventListener('drop', handleDrop as EventListener, false);
    };
  }, []);

  // Move AuthProvider outside of the conditional rendering so it always runs
  return (
    <AuthProvider>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
        </div>
      ) : (
        <Router>
          {user ? (
            <Suspense fallback={
              <div className="min-h-screen bg-gray-50">
                <LoadingFallback message="Loading page..." size="lg" className="min-h-screen" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Navigate to="/documents" replace />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/document/:id" element={<ReadingPage />} />
              </Routes>
            </Suspense>
          ) : (
            <Login />
          )}
        </Router>
      )}
    </AuthProvider>
  );
}

export default App
