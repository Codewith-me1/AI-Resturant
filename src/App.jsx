import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Context Providers
import { RestaurantProvider } from './context/RestaurantContext'
import { CustomerProvider } from './context/CustomerContext'
import { AuthProvider } from './context/AuthContext'

// Connection Status Component
import ConnectionStatus from './components/ConnectionStatus'

// Auth Components
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import QRRegistration from './components/auth/QRRegistration'
import ForgotPassword from './components/auth/ForgotPassword'
import AuthCallback from './components/auth/AuthCallback'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Main Components
import LandingPage from './components/LandingPage'
import QRScanner from './components/QRScanner'
import CustomerDashboard from './components/customer/CustomerDashboard'
import RestaurantDashboard from './components/restaurant/RestaurantDashboard'
import MenuView from './components/customer/MenuView'
import PreferencesSetup from './components/customer/PreferencesSetup'
import OrderHistory from './components/customer/OrderHistory'
import CartView from './components/customer/CartView'
import OrderConfirmation from './components/customer/OrderConfirmation'
import MenuManagement from './components/restaurant/MenuManagement'
import Analytics from './components/restaurant/Analytics'
import Settings from './components/restaurant/Settings'

// Super Admin Components
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard'
import RestaurantManagement from './components/superadmin/RestaurantManagement'
import QRCodeManager from './components/superadmin/QRCodeManager'
import GlobalAnalytics from './components/superadmin/GlobalAnalytics'
import UserManagement from './components/superadmin/UserManagement'
import SystemSettings from './components/superadmin/SystemSettings'

// Test Component
import DatabaseTest from './components/DatabaseTest'

function App() {
  const [userType, setUserType] = useState(null)
  const [currentRestaurant, setCurrentRestaurant] = useState(null)

  // Check URL for direct navigation
  useEffect(() => {
    const path = window.location.hash
    if (path.includes('superadmin')) {
      setUserType('superadmin')
    } else if (path.includes('restaurant')) {
      setUserType('restaurant')
    } else if (path.includes('customer') || path.includes('menu') || path.includes('scan') || path.includes('cart')) {
      setUserType('customer')
    }
  }, [])

  return (
    <AuthProvider>
      <RestaurantProvider>
        <CustomerProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
              {/* Connection Status Indicator */}
              <ConnectionStatus />

              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <LandingPage onUserTypeSelect={setUserType} userType={userType} />
                      </ProtectedRoute>
                    }
                  />

                  {/* Database Test Route */}
                  <Route path="/test" element={<DatabaseTest />} />

                  {/* Auth Routes */}
                  <Route
                    path="/auth/login"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <LoginForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/auth/signup"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <SignupForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/auth/qr-register"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <QRRegistration />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/auth/forgot-password"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <ForgotPassword />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Customer Routes - Updated to redirect to customer dashboard */}
                  <Route
                    path="/scan"
                    element={
                      <ProtectedRoute>
                        <QRScanner onRestaurantFound={setCurrentRestaurant} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  {/* Default customer route - redirect to customer dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/menu/:restaurantId"
                    element={
                      <ProtectedRoute>
                        <MenuView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/preferences"
                    element={
                      <ProtectedRoute>
                        <PreferencesSetup />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    }
                  />

                  {/* Restaurant Routes */}
                  <Route
                    path="/restaurant"
                    element={
                      <ProtectedRoute userType="restaurant">
                        <RestaurantDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/restaurant/menu"
                    element={
                      <ProtectedRoute userType="restaurant">
                        <MenuManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/restaurant/analytics"
                    element={
                      <ProtectedRoute userType="restaurant">
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/restaurant/settings"
                    element={
                      <ProtectedRoute userType="restaurant">
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Super Admin Routes */}
                  <Route
                    path="/superadmin"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <SuperAdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/superadmin/dashboard" element={<Navigate to="/superadmin" replace />} />
                  <Route path="/admin" element={<Navigate to="/superadmin" replace />} />
                  <Route path="/admin/dashboard" element={<Navigate to="/superadmin" replace />} />
                  <Route
                    path="/superadmin/restaurants"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <RestaurantManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/users"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/restaurant/:restaurantId/menu"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <MenuManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/restaurant/:restaurantId/qr"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <QRCodeManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/qr-manager"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <QRCodeManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/analytics"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <GlobalAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/settings"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <SystemSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin/platform-settings"
                    element={
                      <ProtectedRoute userType="superadmin">
                        <SystemSettings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback - Redirect to customer dashboard for authenticated users */}
                  <Route 
                    path="*" 
                    element={
                      <ProtectedRoute>
                        <Navigate to="/customer" replace />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </Router>
        </CustomerProvider>
      </RestaurantProvider>
    </AuthProvider>
  )
}

export default App