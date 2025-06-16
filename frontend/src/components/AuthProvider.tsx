import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { onAuthStateChange } from '../lib/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    const unsubscribe = onAuthStateChange((user) => {
      console.log('AuthProvider: Auth state changed, user:', user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
};