import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "./Auth/AuthContext"

const ProtectedRoute = () => {
  const { user } = useAuth()
  const location = useLocation()

  // 1. While auth status is loading, optionally show a spinner
  //   if (isLoading) {
  //     return <div>Loading...</div>
  //   }

  // 2. If not authenticated, redirect to login, preserving where they were going
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  // 3. Otherwise render child routes
  return <Outlet />
}

export default ProtectedRoute
