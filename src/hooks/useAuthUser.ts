import { useQuery } from "@tanstack/react-query"
import { apiRequest, ApiError } from "@/api/client"
import { useAuthStore } from "@/store/auth"
import type { User } from "@/types/user"

export function useAuthUser() {
  const { user, setUser } = useAuthStore()

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const me = await apiRequest<User>("/api/me")
      setUser(me)
      return me
    },
    initialData: user ?? undefined,
    retry: (count, error) => {
      if (error instanceof ApiError && error.status === 401) {
        return false
      }
      return count < 1
    },
  })
}
