import { AuthProvider } from './components/AuthProvider';
import { Login } from './components/Login';
import { useAuthStore } from './store/authStore';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DocumentsPage from './pages/DocumentsPage';
import ReadingPage from './pages/ReadingPage';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        {user ? (
          <Routes>
            <Route path="/" element={<Navigate to="/documents" replace />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/document/:id" element={<ReadingPage />} />
          </Routes>
        ) : (
          <Login />
        )}
      </Router>
    </AuthProvider>
  );
}

export default App
