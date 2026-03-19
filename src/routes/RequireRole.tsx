import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthUser } from "@/hooks/useAuthUser"
import { ApiError } from "@/api/client"
import type { UserRole } from "@/types/user"

type RequireRoleProps = {
  roles: UserRole[]
}

export function RequireRole({ roles }: RequireRoleProps) {
  const location = useLocation()
  const { data, isLoading, error } = useAuthUser()

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (error instanceof ApiError && error.status === 401) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!data || !roles.includes(data.role)) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
