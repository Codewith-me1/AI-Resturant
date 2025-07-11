import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, requireAuth = true, userType = null }) => {
  const { user, loading } = useAuth()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" replace />
  }

  // If user is logged in but shouldn't be (like guest pages)
  if (!requireAuth && user) {
    const userTypeFromMetadata = user.user_metadata?.user_type || 'customer'
    switch (userTypeFromMetadata) {
      case 'restaurant':
        return <Navigate to="/restaurant" replace />
      case 'superadmin':
        return <Navigate to="/superadmin" replace />
      default:
        return <Navigate to="/customer" replace />
    }
  }

  // If specific user type is required
  if (userType && user) {
    const userTypeFromMetadata = user.user_metadata?.user_type || 'customer'
    if (userTypeFromMetadata !== userType) {
      // Redirect to appropriate dashboard based on actual user type
      switch (userTypeFromMetadata) {
        case 'restaurant':
          return <Navigate to="/restaurant" replace />
        case 'superadmin':
          return <Navigate to="/superadmin" replace />
        default:
          return <Navigate to="/customer" replace />
      }
    }
  }

  return children
}

export default ProtectedRoute