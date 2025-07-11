import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../context/AuthContext'

const { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiAlertCircle, FiCheckCircle, FiQrCode } = FiIcons

const SignupForm = () => {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, loading } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', userType: 'customer' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      console.log('📝 Signing up user:', formData.email, 'as', formData.userType)
      const { data, error: authError } = await signUp(
        formData.email,
        formData.password,
        { name: formData.name, userType: formData.userType }
      )

      if (authError) {
        setError(authError.message)
        return
      }

      console.log('✅ Signup successful:', data)
      setSuccess('Account created successfully! You can now sign in with your credentials.')

      // Redirect to appropriate dashboard after successful registration
      setTimeout(() => {
        switch (formData.userType) {
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
      }, 2000)
    } catch (err) {
      console.error('Signup error:', err)
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
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    }
  }

  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join TasteMate today</p>
        </div>

        {/* QR Registration Option */}
        <motion.div
          className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiQrCode} className="text-2xl text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-800">Quick Registration</h4>
                <p className="text-sm text-orange-700">Scan a restaurant QR code to register instantly</p>
              </div>
            </div>
            <motion.button
              onClick={() => navigate('/auth/qr-register')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Scan QR
            </motion.button>
          </div>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
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

          {/* Success Message */}
          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SafeIcon icon={FiCheckCircle} className="text-lg flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </motion.div>
          )}

          {/* Important Note */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Important Note</h4>
            <p className="text-sm text-yellow-700">
              Email verification might be enabled in Supabase. If you don't receive a confirmation email, please use the pre-created demo accounts or create an account with a real email address.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant Owner</option>
                <option value="superadmin">Super Admin</option>
              </select>
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
                  placeholder="Create a password"
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
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={showConfirmPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
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
                  Creating Account...
                </div>
              ) : (
                'Create Account'
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

            {/* Google Sign Up */}
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

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignupForm