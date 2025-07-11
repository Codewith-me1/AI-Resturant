import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, testConnection } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('connecting')

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing Auth Context...')
        
        // Test connection first
        const connectionTest = await testConnection()
        if (!connectionTest.success) {
          console.error('❌ Supabase connection failed:', connectionTest.error)
          setConnectionStatus('failed')
          if (mounted) setLoading(false)
          return
        }
        
        setConnectionStatus('connected')
        console.log('✅ Supabase connection established')

        // Get initial session
        const { data: sessionData, error: sessionError } = await auth.getSession()
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError)
        } else if (sessionData?.session) {
          console.log('✅ Existing session found:', sessionData.session.user?.email)
          if (mounted) {
            setSession(sessionData.session)
            setUser(sessionData.session.user)
          }
        } else {
          console.log('ℹ️ No existing session')
        }

        if (mounted) setLoading(false)
      } catch (err) {
        console.error('❌ Auth initialization error:', err)
        setConnectionStatus('failed')
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event, session?.user?.email)
      
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle different auth events
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', session?.user?.email)
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed for:', session?.user?.email)
      } else if (event === 'USER_UPDATED') {
        console.log('👤 User updated:', session?.user?.email)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, userData = {}) => {
    if (connectionStatus !== 'connected') {
      return { 
        data: null, 
        error: { message: 'Database connection not available. Please check your internet connection and try again.' }
      }
    }

    setLoading(true)
    try {
      console.log('📝 Attempting to sign up:', email)
      
      const result = await auth.signUp(email, password, userData)
      
      if (result.error) {
        console.error('❌ Sign up error:', result.error.message)
      } else {
        console.log('✅ Sign up successful:', result.data.user?.email)
      }
      
      return result
    } catch (error) {
      console.error('❌ Sign up failed:', error.message)
      return { data: null, error: { message: error.message || 'Sign up failed' } }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    if (connectionStatus !== 'connected') {
      return { 
        data: null, 
        error: { message: 'Database connection not available. Please check your internet connection and try again.' }
      }
    }

    setLoading(true)
    try {
      console.log('🔑 Attempting to sign in:', email)
      
      const result = await auth.signIn(email, password)
      
      if (result.error) {
        console.error('❌ Sign in error:', result.error.message)
      } else {
        console.log('✅ Sign in successful:', result.data.user?.email)
      }
      
      return result
    } catch (error) {
      console.error('❌ Sign in failed:', error.message)
      return { data: null, error: { message: error.message || 'Sign in failed' } }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (connectionStatus !== 'connected') {
      return { 
        data: null, 
        error: { message: 'Database connection not available. Please check your internet connection and try again.' }
      }
    }

    try {
      console.log('🌐 Attempting Google sign in')
      return await auth.signInWithGoogle()
    } catch (error) {
      console.error('❌ Google sign in failed:', error.message)
      return { data: null, error: { message: error.message || 'Google sign in failed' } }
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      console.log('👋 Signing out')
      const result = await auth.signOut()
      
      if (result.error) {
        console.error('❌ Sign out error:', result.error.message)
      } else {
        console.log('✅ Sign out successful')
      }
      
      return result
    } catch (error) {
      console.error('❌ Sign out failed:', error.message)
      return { error: { message: error.message || 'Sign out failed' } }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    if (connectionStatus !== 'connected') {
      return { 
        data: null, 
        error: { message: 'Database connection not available. Please check your internet connection and try again.' }
      }
    }

    try {
      console.log('🔄 Requesting password reset for:', email)
      return await auth.resetPassword(email)
    } catch (error) {
      console.error('❌ Password reset failed:', error.message)
      return { data: null, error: { message: error.message || 'Password reset failed' } }
    }
  }

  const updatePassword = async (password) => {
    if (connectionStatus !== 'connected') {
      return { 
        data: null, 
        error: { message: 'Database connection not available. Please check your internet connection and try again.' }
      }
    }

    try {
      console.log('🔄 Updating password')
      return await auth.updatePassword(password)
    } catch (error) {
      console.error('❌ Password update failed:', error.message)
      return { data: null, error: { message: error.message || 'Password update failed' } }
    }
  }

  const value = {
    user,
    session,
    loading,
    connectionStatus,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}