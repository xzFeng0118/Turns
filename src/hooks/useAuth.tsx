import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { AuthService } from '@/services/authService';
import type { SignInInput, User } from '@/types/auth';

type AuthContextValue = {
  currentUser: User | null;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error?: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const signIn = useCallback(async (input: SignInInput) => {
    setIsLoading(true);
    setError(undefined);

    const result = await AuthService.signIn(input);

    if (!result.ok) {
      setIsLoading(false);
      setError(result.reason === 'invalid_credentials' ? 'Invalid credentials.' : 'Sign-in failed.');
      return;
    }

    setCurrentUser(result.user);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      await AuthService.signOut();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      signIn,
      signOut,
      isLoading,
      error,
    }),
    [currentUser, signIn, signOut, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
