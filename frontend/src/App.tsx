import { AuthProvider } from './components/AuthProvider';
import { Login } from './components/Login';
import { useAuthStore } from './store/authStore';
import { signOut } from './lib/auth';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-900">grasp.now</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user.displayName}</span>
                  <button
                    onClick={signOut}
                    className="btn-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="card p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to grasp.now
              </h2>
              <p className="text-gray-600 mb-8">
                Transform your documents with intelligent lenses
              </p>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-sm text-gray-600">
                  🚀 MVP Phase 1 in progress - Document management and lens system coming soon!
                </p>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <Login />
      )}
    </AuthProvider>
  );
}

export default App
