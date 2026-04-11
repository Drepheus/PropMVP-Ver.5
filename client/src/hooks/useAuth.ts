import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // If there's a connection error, treat as not authenticated
  // but don't show loading state indefinitely
  const hasConnectionError = error && (
    error.message.includes('Failed to fetch') ||
    error.message.includes('NetworkError') ||
    error.message.includes('500')
  );

  return {
    user,
    isLoading: isLoading && !hasConnectionError,
    isAuthenticated: !!user,
    hasError: !!error,
  };
}