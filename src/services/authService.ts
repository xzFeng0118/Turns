import type { SignInInput, User } from '@/types/auth';

type SignInResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'invalid_credentials' | 'error'; error?: unknown };

export const AuthService = {
  async signIn(input: SignInInput): Promise<SignInResult> {
    try {
      const email = input.email.trim().toLowerCase();

      if (!email || !input.password) {
        return { ok: false, reason: 'invalid_credentials' };
      }

      return {
        ok: true,
        user: {
          id: 'user_1',
          name: 'Mock User',
          email,
        },
      };
    } catch (error) {
      return { ok: false, reason: 'error', error };
    }
  },

  async signOut(): Promise<void> {
    return;
  },
};
