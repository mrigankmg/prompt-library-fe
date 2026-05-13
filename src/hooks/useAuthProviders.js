import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/api";
import { queryKeys } from "../query/keys";

export function useAuthProviders() {
  return useQuery({
    queryKey: queryKeys.auth.providers,
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/auth/providers");
      return data.providers ?? [];
    },
    staleTime: Infinity,
    retry: false,
  });
}
