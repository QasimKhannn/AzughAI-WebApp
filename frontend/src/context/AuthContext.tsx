import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    // No-op - always return true
    console.log('Login called (no-op):', email);
    return true;
  };

  const logout = async (): Promise<void> => {
    // No-op
    console.log('Logout called (no-op)');
  };

  return (
    <AuthContext.Provider value={{ user: null, login, logout, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
