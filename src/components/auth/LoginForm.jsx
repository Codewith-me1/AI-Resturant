import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiAlertCircle, FiRefreshCw } = FiIcons

const LoginForm = () => {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [creatingAccounts, setCreatingAccounts] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { data, error: authError } = await signIn(formData.email, formData.password)

      if (authError) {
        setError(authError.message)
        return
      }

      // Redirect based on user type or default to customer dashboard
      const userType = data.user?.user_metadata?.user_type || 'customer'
      console.log('🎯 Redirecting user type:', userType)
      
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
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      const { error: authError } = await signInWithGoogle()
      if (authError) {
        setError(authError.message)
      }
      // Google OAuth will redirect, so no need to handle success here
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    }
  }

  const createDemoAccounts = async () => {
    setCreatingAccounts(true)
    setError('')

    try {
      // Create customer account
      await supabase.auth.signUp({
        email: 'customer@demo.com',
        password: 'password123',
        options: {
          data: {
            name: 'Demo Customer',
            user_type: 'customer'
          }
        }
      })

      // Create restaurant account
      await supabase.auth.signUp({
        email: 'restaurant@demo.com',
        password: 'password123',
        options: {
          data: {
            name: 'Demo Restaurant',
            user_type: 'restaurant'
          }
        }
      })

      // Create admin account
      await supabase.auth.signUp({
        email: 'admin@demo.com',
        password: 'password123',
        options: {
          data: {
            name: 'Demo Admin',
            user_type: 'superadmin'
          }
        }
      })

      alert('Demo accounts created successfully! You may need to verify emails in Supabase dashboard or disable email confirmation.')
    } catch (err) {
      setError('Failed to create demo accounts: ' + err.message)
    } finally {
      setCreatingAccounts(false)
    }
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your TasteMate account</p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {/* Demo Credentials Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-blue-800">🎯 Demo Accounts</h4>
              <button
                onClick={createDemoAccounts}
                disabled={creatingAccounts}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1"
              >
                {creatingAccounts ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiRefreshCw} className="text-xs" />
                    Create Accounts
                  </>
                )}
              </button>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Customer:</strong> customer@demo.com / password123</div>
              <div><strong>Restaurant:</strong> restaurant@demo.com / password123</div>
              <div><strong>Admin:</strong> admin@demo.com / password123</div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SafeIcon icon={FiAlertCircle} className="text-lg flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isSubmitting || loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginForm