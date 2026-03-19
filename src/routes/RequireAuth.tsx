import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthUser } from "@/hooks/useAuthUser"
import { ApiError } from "@/api/client"

export function RequireAuth() {
  const location = useLocation()
  const { data, isLoading, error } = useAuthUser()

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (error instanceof ApiError && error.status === 401) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!data) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
