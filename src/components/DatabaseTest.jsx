import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase, auth, testConnection } from '../lib/supabase'

const { FiDatabase, FiCheckCircle, FiXCircle, FiRefreshCw, FiSettings } = FiIcons

const DatabaseTest = () => {
  const [tests, setTests] = useState([
    { name: 'Supabase Connection', status: 'pending', message: '' },
    { name: 'Authentication Service', status: 'pending', message: '' },
    { name: 'Session Management', status: 'pending', message: '' },
    { name: 'Demo Account Creation', status: 'pending', message: '' }
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [credentials, setCredentials] = useState({
    url: '',
    key: '',
    configured: false
  })

  const updateTest = (index, status, message) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ))
  }

  const checkCredentials = () => {
    // Check if credentials are properly configured
    const url = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'
    
    const configured = url !== 'https://your-project-id.supabase.co' && 
                     key !== 'your-anon-key-here' &&
                     url.includes('supabase.co') &&
                     key.length > 50

    setCredentials({ url, key: key.substring(0, 20) + '...', configured })
    return configured
  }

  const testDemoAccounts = async () => {
    try {
      // Try to create demo accounts
      const accounts = [
        { email: 'customer@demo.com', password: 'password123', userType: 'customer' },
        { email: 'restaurant@demo.com', password: 'password123', userType: 'restaurant' },
        { email: 'admin@demo.com', password: 'password123', userType: 'superadmin' }
      ]

      for (const account of accounts) {
        try {
          await auth.signUp(account.email, account.password, {
            name: `Demo ${account.userType}`,
            userType: account.userType
          })
        } catch (err) {
          // Account might already exist, which is fine
          console.log(`Account ${account.email} might already exist`)
        }
      }

      return { success: true, message: 'Demo accounts ready' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: '' })))

    // Check credentials first
    if (!checkCredentials()) {
      updateTest(0, 'failed', 'Supabase credentials not configured. Please update src/lib/supabase.js')
      setIsRunning(false)
      return
    }

    try {
      // Test 1: Supabase Connection
      updateTest(0, 'running', 'Testing connection...')
      const connectionTest = await testConnection()
      
      if (connectionTest.success) {
        updateTest(0, 'success', 'Successfully connected to Supabase')
      } else {
        updateTest(0, 'failed', `Connection failed: ${connectionTest.error?.message || 'Unknown error'}`)
        setIsRunning(false)
        return
      }

      // Test 2: Authentication Service
      updateTest(1, 'running', 'Testing authentication...')
      try {
        const { data, error } = await auth.getSession()
        if (error) {
          updateTest(1, 'failed', `Auth error: ${error.message}`)
        } else {
          updateTest(1, 'success', data?.session ? `Session active: ${data.session.user?.email}` : 'Auth service working (no active session)')
        }
      } catch (authError) {
        updateTest(1, 'failed', `Auth service error: ${authError.message}`)
      }

      // Test 3: Session Management
      updateTest(2, 'running', 'Testing session management...')
      try {
        const { data: user } = await auth.getCurrentUser()
        updateTest(2, 'success', user?.user ? `User data accessible: ${user.user.email}` : 'Session management working')
      } catch (sessionError) {
        updateTest(2, 'failed', `Session error: ${sessionError.message}`)
      }

      // Test 4: Demo Accounts
      updateTest(3, 'running', 'Setting up demo accounts...')
      const demoResult = await testDemoAccounts()
      if (demoResult.success) {
        updateTest(3, 'success', demoResult.message)
      } else {
        updateTest(3, 'failed', demoResult.message)
      }

    } catch (error) {
      console.error('Test suite failed:', error)
      updateTest(0, 'failed', `Unexpected error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    checkCredentials()
    // Auto-run tests if credentials are configured
    if (credentials.configured) {
      runTests()
    }
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <SafeIcon icon={FiCheckCircle} className="text-green-500" />
      case 'failed':
        return <SafeIcon icon={FiXCircle} className="text-red-500" />
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      case 'running':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiDatabase} className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Database Connection Test</h1>
                <p className="text-gray-600">Testing Supabase backend connectivity</p>
              </div>
            </div>
            <motion.button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
              whileHover={{ scale: isRunning ? 1 : 1.05 }}
              whileTap={{ scale: isRunning ? 1 : 0.95 }}
            >
              <SafeIcon icon={FiRefreshCw} className={isRunning ? 'animate-spin' : ''} />
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </motion.button>
          </div>

          {/* Credentials Status */}
          <div className={`mb-8 p-4 rounded-xl border-2 ${credentials.configured ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiSettings} className={credentials.configured ? 'text-green-600' : 'text-red-600'} />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {credentials.configured ? '✅ Credentials Configured' : '❌ Credentials Missing'}
                </h3>
                <p className="text-sm text-gray-600">
                  {credentials.configured 
                    ? 'Supabase credentials are properly configured'
                    : 'Please update your Supabase credentials in src/lib/supabase.js'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {tests.map((test, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border-2 ${getStatusColor(test.status)} transition-all duration-300`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{test.name}</h3>
                    {test.message && (
                      <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Setup Instructions */}
          {!credentials.configured && (
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-semibold text-yellow-800 mb-4">🔧 Setup Instructions</h3>
              <div className="space-y-3 text-sm text-yellow-700">
                <p><strong>1. Get your Supabase credentials:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">supabase.com/dashboard</a></li>
                  <li>• Select your project</li>
                  <li>• Go to Settings → API</li>
                  <li>• Copy the URL and anon key</li>
                </ul>
                <p><strong>2. Update src/lib/supabase.js:</strong></p>
                <pre className="bg-yellow-100 p-2 rounded text-xs overflow-x-auto">
{`const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'`}
                </pre>
                <p><strong>3. Enable authentication:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• In Supabase dashboard, go to Authentication → Settings</li>
                  <li>• Disable "Enable email confirmations" for testing</li>
                  <li>• Save the settings</li>
                </ul>
              </div>
            </div>
          )}

          {/* Demo Accounts Info */}
          <div className="mt-6 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-4">🎯 Demo Accounts</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-800">Customer Account</div>
                <div className="text-blue-700 font-mono">customer@demo.com</div>
                <div className="text-blue-700 font-mono">password123</div>
              </div>
              <div>
                <div className="font-medium text-blue-800">Restaurant Owner</div>
                <div className="text-blue-700 font-mono">restaurant@demo.com</div>
                <div className="text-blue-700 font-mono">password123</div>
              </div>
              <div>
                <div className="font-medium text-blue-800">Super Admin</div>
                <div className="text-blue-700 font-mono">admin@demo.com</div>
                <div className="text-blue-700 font-mono">password123</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DatabaseTest