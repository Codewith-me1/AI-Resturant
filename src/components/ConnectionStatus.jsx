import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../context/AuthContext'

const { FiWifi, FiWifiOff, FiAlertCircle, FiRefreshCw } = FiIcons

const ConnectionStatus = () => {
  const { connectionStatus } = useAuth()

  if (connectionStatus === 'connected') {
    return null // Don't show anything when connected
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className={`px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border-2 flex items-center gap-3 ${
          connectionStatus === 'connecting' 
            ? 'bg-blue-50/90 border-blue-200 text-blue-800'
            : 'bg-red-50/90 border-red-200 text-red-800'
        }`}>
          {connectionStatus === 'connecting' ? (
            <>
              <SafeIcon icon={FiRefreshCw} className="animate-spin" />
              <span className="font-medium">Connecting to database...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiWifiOff} />
              <span className="font-medium">Database connection failed</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConnectionStatus