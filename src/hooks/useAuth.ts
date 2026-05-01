import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const signOut = useAuthStore((state) => state.signOut);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    checkAuth,
    clearError,
  };
}
