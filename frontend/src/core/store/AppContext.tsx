import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../../domain/models';
import { AuthApi } from '../../api/endpoints/auth.api';

interface AppContextType {
  user: User | null;
  activeRole: Role;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  setActiveRole: (role: Role) => void;
  // Cart state
  cartCount: number;
  addToCart: () => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('customer');
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await AuthApi.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setActiveRole(response.data.role);
        }
      } catch (error) {
        console.error('Failed to init auth', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (phone: string, otp: string) => {
    setIsLoading(true);
    const response = await AuthApi.verifyOtp({ phone, otp });
    if (response.success && response.data) {
      setUser(response.data.user);
      setActiveRole(response.data.user.role);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await AuthApi.logout();
    setUser(null);
    setActiveRole('customer');
    setIsLoading(false);
  };

  const addToCart = () => setCartCount((prev) => prev + 1);
  const clearCart = () => setCartCount(0);

  return (
    <AppContext.Provider
      value={{
        user,
        activeRole,
        isLoading,
        login,
        logout,
        setActiveRole,
        cartCount,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
