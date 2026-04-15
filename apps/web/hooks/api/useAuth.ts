import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { AuthResponse } from '../../types/api';
import { useAuthContext } from '../../contexts/auth-context';
import { useTenantContext } from '../../contexts/tenant-context';

export function useAuth() {
  const { login: setAuth, logout: clearAuth } = useAuthContext();
  const { clearTenantId } = useTenantContext();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      api.post<AuthResponse>('/auth/sign-in', credentials),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(['profile'], data.user);
    },
  });

  // SignUp mutation
  const signUpMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => 
      api.post<AuthResponse>('/auth/sign-up', data),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(['profile'], data.user);
    },
  });

  // Since Profile is initially fetched in AuthProvider, we can add a mutation to logout
  const logout = () => {
    clearAuth();
    clearTenantId();
    queryClient.clear();
  };


  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    error: loginMutation.error || signUpMutation.error,
    logout,
  };
}

