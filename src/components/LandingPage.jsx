import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../context/AuthContext'
import UserProfile from './common/UserProfile'

const { FiSmartphone, FiUsers, FiStar, FiArrowRight, FiQrCode, FiBrain, FiTrendingUp, FiSettings, FiShield, FiLogIn, FiUserPlus } = FiIcons

const LandingPage = ({ onUserTypeSelect, userType }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleCustomerStart = () => {
    onUserTypeSelect('customer')
    navigate('/scan')
  }

  const handleRestaurantStart = () => {
    onUserTypeSelect('restaurant')
    navigate('/restaurant')
  }

  const handleSuperAdminStart = () => {
    onUserTypeSelect('superadmin')
    navigate('/superadmin')
  }

  const features = [
    {
      icon: FiQrCode,
      title: 'Universal QR Registration',
      description: 'One QR code scan gives you access to all participating restaurants instantly'
    },
    {
      icon: FiBrain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized food suggestions based on your preferences and dietary needs'
    },
    {
      icon: FiTrendingUp,
      title: 'Smart Analytics',
      description: 'Restaurant owners get detailed insights into customer preferences and ordering patterns'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header with Auth */}
      <motion.div
        className="absolute top-4 right-4 z-50 flex items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {user ? (
          <UserProfile />
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/auth/login')}
              className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <SafeIcon icon={FiLogIn} className="text-sm" />
              Sign In
            </button>
            <button
              onClick={() => navigate('/auth/qr-register')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <SafeIcon icon={FiUserPlus} className="text-sm" />
              QR Register
            </button>
            <button
              onClick={handleSuperAdminStart}
              className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <SafeIcon icon={FiShield} className="text-sm" />
              Admin
            </button>
          </div>
        )}
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-6 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            TasteMate
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience the future of dining with universal QR registration, AI-powered menu recommendations, and seamless access to all participating restaurants.
          </motion.p>

          {/* Universal QR Registration Highlight */}
          <motion.div
            className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <SafeIcon icon={FiQrCode} className="text-3xl text-green-600" />
              <h3 className="text-2xl font-bold text-green-800">Universal QR Registration!</h3>
            </div>
            <p className="text-green-700 mb-4">
              Scan one QR code to create your account and instantly access ALL participating restaurants. No need to register separately for each restaurant!
            </p>
            <motion.button
              onClick={() => navigate('/auth/qr-register')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiUserPlus} className="text-xl" />
              Try Universal Registration
              <SafeIcon icon={FiArrowRight} className="text-lg" />
            </motion.button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={feature.icon} className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.button
            onClick={handleCustomerStart}
            className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiSmartphone} className="text-xl" />
            I'm a Customer
            <SafeIcon icon={FiArrowRight} className="text-lg group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={handleRestaurantStart}
            className="group bg-white text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiUsers} className="text-xl" />
            I'm a Restaurant Owner
            <SafeIcon icon={FiArrowRight} className="text-lg group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={handleSuperAdminStart}
            className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiSettings} className="text-xl" />
            Super Admin
            <SafeIcon icon={FiArrowRight} className="text-lg group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Authentication Notice for Logged In Users */}
        {user && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-green-800">
                Welcome back, <strong>{user.user_metadata?.name || user.email}</strong>!
                <br />
                <span className="text-sm">
                  Account type: <span className="capitalize">{user.user_metadata?.user_type || 'customer'}</span>
                </span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Direct URL Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Access URLs</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="font-medium text-orange-800">Customer</div>
                <div className="text-orange-600 font-mono">/scan</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="font-medium text-green-800">Universal QR</div>
                <div className="text-green-600 font-mono">/auth/qr-register</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="font-medium text-blue-800">Restaurant</div>
                <div className="text-blue-600 font-mono">/restaurant</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="font-medium text-purple-800">Super Admin</div>
                <div className="text-purple-600 font-mono">/superadmin</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold text-red-600 mb-2">2.5x</div>
            <div className="text-gray-600">Order Accuracy Improvement</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold text-pink-600 mb-2">45%</div>
            <div className="text-gray-600">Faster Service</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LandingPage