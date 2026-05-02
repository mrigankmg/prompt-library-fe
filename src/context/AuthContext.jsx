import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient, registerAuthFailureHandler, ApiError } from "../utils/api";
import { queryKeys } from "../query/keys";

const AuthContext = createContext();

async function fetchMe() {
  const response = await apiClient.get("/api/v1/users/me");
  return response.data;
}

export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        return await fetchMe();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          return null;
        }
        throw e;
      }
    },
    staleTime: 60_000,
    retry: false,
  });

  const user = meQuery.data ?? null;
  const isLoading = meQuery.isPending;
  const isAuthenticated = !!user;

  const registerMutation = useMutation({
    mutationFn: async ({ firstName, lastName, email, password }) => {
      await apiClient.post("/api/v1/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      await apiClient.post("/api/v1/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/api/v1/auth/logout");
      } finally {
        queryClient.removeQueries({ queryKey: ["prompts"] });
        queryClient.setQueryData(queryKeys.auth.me, null);
      }
    },
  });

  const register = useCallback(
    (firstName, lastName, email, password) =>
      registerMutation.mutateAsync({ firstName, lastName, email, password }),
    [registerMutation],
  );

  const login = useCallback(
    (formData) => loginMutation.mutateAsync(formData),
    [loginMutation],
  );

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation],
  );

  useEffect(() => {
    registerAuthFailureHandler(() => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      queryClient.removeQueries({ queryKey: ["prompts"] });
    });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
      authError: meQuery.error,
    }),
    [user, isLoading, login, logout, register, meQuery.error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
