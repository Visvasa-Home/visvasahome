import { useState, useEffect } from 'react';
import { User } from '@core/db/supabaseClient';
import { getCurrentUser, getCurrentSession, signOut } from '@auth/services/auth';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isProfessional: boolean;
  isCustomer: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    isProfessional: false,
    isCustomer: false
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const [user, session] = await Promise.all([
        getCurrentUser(),
        getCurrentSession()
      ]);

      setAuthState({
        user,
        session,
        loading: false,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isProfessional: user?.role === 'professional',
        isCustomer: user?.role === 'customer'
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isProfessional: false,
        isCustomer: false
      });
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isProfessional: false,
        isCustomer: false
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshAuth = () => {
    checkAuth();
  };

  return {
    ...authState,
    logout,
    refreshAuth
  };
}
