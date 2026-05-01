import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services';

interface AuthState {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initializing: true,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await authService.signInWithEmail(email, password);
      if (error) throw error;
      if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name,
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await authService.signUpWithEmail(email, password, name);
      if (error) throw error;
      if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name,
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ initializing: true });
    try {
      const { user, error } = await authService.getCurrentUser();
      if (error) throw error;
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name,
          },
          initializing: false,
        });
      } else {
        set({ user: null, initializing: false });
      }
    } catch (err) {
      console.warn('Auth check failed:', err);
      set({ user: null, initializing: false });
    }
  },

  clearError: () => set({ error: null }),
}));
