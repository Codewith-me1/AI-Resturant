import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../context/AuthContext'

const { FiMail, FiArrowLeft, FiAlertCircle, FiCheckCircle } = FiIcons

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email is required')
      setIsSubmitting(false)
      return
    }

    try {
      const { error: authError } = await resetPassword(email)
      
      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess('Password reset email sent! Check your inbox for instructions.')
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            onClick={() => navigate('/auth/login')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            Back to Login
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        {/* Reset Form */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                    if (success) setSuccess('')
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!email || isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: email && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: email && !isSubmitting ? 0.98 : 1 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Email'
              )}
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
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

export default ForgotPassword