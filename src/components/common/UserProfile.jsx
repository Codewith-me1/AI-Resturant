import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const { FiUser, FiSettings, FiLogOut, FiChevronDown } = FiIcons

const UserProfile = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const userInitial = user.user_metadata?.name?.charAt(0).toUpperCase() || 
                     user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {userInitial}
        </div>
        <SafeIcon icon={FiChevronDown} className="text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {user.user_metadata?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs capitalize">
                    {user.user_metadata?.user_type || 'customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/profile')
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <SafeIcon icon={FiUser} className="text-gray-600" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/preferences')
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <SafeIcon icon={FiSettings} className="text-gray-600" />
                <span>Preferences</span>
              </button>

              <hr className="my-2" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
              >
                <SafeIcon icon={FiLogOut} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default UserProfile