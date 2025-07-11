import { createClient } from '@supabase/supabase-js'

// Your actual Supabase project credentials
const supabaseUrl =  'https://xipxftnxusqyaxbvxqsk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcHhmdG54dXNxeWF4YnZ4cXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTk4NzYsImV4cCI6MjA2NzQ3NTg3Nn0.GIvtbqpYvP6q4B17c6hEzdgxBiA-iEeSVIhKl30Hunc'

// Validation check
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!')
  console.error('Please check your Supabase credentials')
}

console.log('🔗 Supabase URL:', supabaseUrl)
console.log('🔑 Anon Key configured:', supabaseAnonKey ? 'Yes' : 'No')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'smart-restaurant-app'
    }
  }
})

// Enhanced auth helper functions with better error handling
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      console.log('🔐 Attempting signup for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            user_type: userData.userType || 'customer',
            registration_source: userData.registrationSource || 'manual',
            restaurant_id: userData.restaurantId || null,
            table_id: userData.tableId || null
          }
        }
      })

      if (error) {
        console.error('❌ Signup error:', error)
        return { data: null, error }
      }

      console.log('✅ Signup successful:', data.user?.email)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Signup exception:', err)
      return { data: null, error: { message: err.message || 'Signup failed' } }
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      console.log('🔐 Attempting signin for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Signin error:', error)
        return { data: null, error }
      }

      console.log('✅ Signin successful:', data.user?.email)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Signin exception:', err)
      return { data: null, error: { message: err.message || 'Signin failed' } }
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      console.log('🌐 Attempting Google signin')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        console.error('❌ Google signin error:', error)
        return { data: null, error }
      }

      console.log('✅ Google signin initiated')
      return { data, error: null }
    } catch (err) {
      console.error('❌ Google signin exception:', err)
      return { data: null, error: { message: err.message || 'Google signin failed' } }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      console.log('👋 Signing out')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Signout error:', error)
        return { error }
      }

      // Clear local storage
      localStorage.removeItem('customerProfile')
      localStorage.removeItem('currentOrder')
      
      console.log('✅ Signout successful')
      return { error: null }
    } catch (err) {
      console.error('❌ Signout exception:', err)
      return { error: { message: err.message || 'Signout failed' } }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      return { data, error }
    } catch (err) {
      console.error('❌ Get user exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      return { data, error }
    } catch (err) {
      console.error('❌ Get session exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      console.log('🔄 Requesting password reset for:', email)
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/auth/reset-password`
      })
      
      if (error) {
        console.error('❌ Password reset error:', error)
      } else {
        console.log('✅ Password reset email sent')
      }
      
      return { data, error }
    } catch (err) {
      console.error('❌ Password reset exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // Update password
  updatePassword: async (password) => {
    try {
      console.log('🔄 Updating password')
      
      const { data, error } = await supabase.auth.updateUser({ password })
      
      if (error) {
        console.error('❌ Password update error:', error)
      } else {
        console.log('✅ Password updated successfully')
      }
      
      return { data, error }
    } catch (err) {
      console.error('❌ Password update exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // Subscribe to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Connection test function
export const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    console.log('📍 URL:', supabaseUrl)
    console.log('🔑 Anon Key (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...')
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Connection test failed:', error)
      return { success: false, error }
    }
    
    console.log('✅ Supabase connection successful')
    console.log('📊 Session data:', data)
    
    return { success: true, data }
  } catch (err) {
    console.error('❌ Connection test exception:', err)
    return { success: false, error: { message: err.message } }
  }
}

// Auto-test connection on load
testConnection()

export default supabase