import { create } from 'zustand';
import { User } from '@/types';
import * as supabaseService from '@/services/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signUp: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.signUp(email, password, name);
      if (error) throw error;
      if (data?.user) {
        set({ user: { id: data.user.id, email: data.user.email || '', name } as User, loading: false });
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.signIn(email, password);
      if (error) throw error;
      if (data?.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name,
          } as User,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabaseService.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const { user, error } = await supabaseService.getCurrentUser();
      if (error) throw error;
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name,
          } as User,
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
