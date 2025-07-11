import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Wait a bit for the session to be established
        setTimeout(() => {
          if (user) {
            // Redirect based on user type
            const userType = user.user_metadata?.user_type || 'customer'
            switch (userType) {
              case 'restaurant':
                navigate('/restaurant')
                break
              case 'superadmin':
                navigate('/superadmin')
                break
              default:
                navigate('/customer')
                break
            }
          } else {
            // If no user after timeout, redirect to login
            navigate('/auth/login')
          }
        }, 2000)
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/auth/login')
      }
    }

    handleAuthCallback()
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you</p>
      </div>
    </div>
  )
}

export default AuthCallback