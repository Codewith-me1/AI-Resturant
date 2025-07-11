import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../context/AuthContext'
import { useRestaurant } from '../../context/RestaurantContext'
import jsQR from 'jsqr'
import QRCode from 'qrcode'

const { FiCamera, FiUpload, FiArrowLeft, FiCheck, FiAlertCircle, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiQrCode, FiStore, FiStar } = FiIcons

const QRRegistration = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signUp } = useAuth()
  const { restaurants } = useRestaurant()
  const [currentStep, setCurrentStep] = useState('scan') // 'scan', 'form', 'restaurants'
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [scannedData, setScannedData] = useState(null)
  const [universalQRCode, setUniversalQRCode] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const scanIntervalRef = useRef(null)

  // Generate universal QR code for registration
  useEffect(() => {
    const generateUniversalQR = async () => {
      try {
        // Universal registration QR code
        const qrData = 'smart-restaurant-universal-register'
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setUniversalQRCode(qrCodeDataURL)
      } catch (error) {
        console.error('Error generating universal QR code:', error)
      }
    }
    generateUniversalQR()
  }, [])

  const processQRCode = (qrData) => {
    try {
      // Any QR code is now treated as universal registration
      setScannedData({ type: 'universal_registration' })
      setSuccess('Universal registration QR detected! Please complete your registration.')
      setCurrentStep('form')
      stopCamera()
      return true
    } catch (err) {
      setError('Invalid QR code format.')
      return false
    }
  }

  const handleDemoScan = () => {
    setScanning(true)
    setError('')
    // Simulate scanning a universal registration QR code
    setTimeout(() => {
      const demoQRData = 'smart-restaurant-universal-register'
      processQRCode(demoQRData)
      setScanning(false)
    }, 2000)
  }

  const scanQRCode = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return
    }

    const context = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      if (processQRCode(code.data)) {
        setScanning(false)
      } else {
        setTimeout(() => {
          setScanning(false)
          setError('')
        }, 3000)
      }
    }
  }

  const startCamera = async () => {
    try {
      setError('')
      setScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        // Start scanning loop
        scanIntervalRef.current = setInterval(scanQRCode, 500)
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or use Demo Scan.')
      setScanning(false)
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setError('')
    setScanning(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          if (processQRCode(code.data)) {
            setScanning(false)
          } else {
            setTimeout(() => {
              setScanning(false)
              setError('')
            }, 3000)
          }
        } else {
          setError('No QR code found in the image.')
          setScanning(false)
        }
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      const { data, error: authError } = await signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          userType: 'customer',
          registrationSource: 'qr_universal_registration'
        }
      )

      if (authError) {
        setError(authError.message)
        return
      }
      setSuccess('Account created successfully! Welcome to TasteMate!')
      
      // After successful registration, navigate to customer dashboard
      setTimeout(() => {
        navigate('/customer')
      }, 2000)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  // Registration Form Step
  if (currentStep === 'form') {
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
              onClick={() => setCurrentStep('scan')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} />
              Back to Scanner
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join TasteMate and access all participating restaurants!</p>
          </div>

          {/* Universal Registration Info */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiQrCode} className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Universal Access</h3>
                <p className="text-gray-600">One account for all restaurants</p>
                <div className="flex items-center gap-1 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                  <span className="text-sm text-green-600">QR Code Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
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
                <SafeIcon icon={FiCheck} className="text-lg flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

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

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account & Access All Restaurants'
                )}
              </motion.button>
            </form>

            {/* Already have account link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/auth/login')}
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // QR Scanner Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/auth/signup')}
            className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Universal QR Registration</h1>
        </motion.div>

        {/* Scanner Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <SafeIcon icon={FiQrCode} className="text-lg" />
              <span className="font-medium">Universal Registration Scanner</span>
            </div>
            <p className="text-blue-700 text-sm">
              Scan the universal registration QR code below to create your account and access all restaurants with one account!
            </p>
          </div>

          {/* Universal QR Code Display */}
          {universalQRCode && (
            <motion.div
              className="bg-gray-50 rounded-2xl p-6 mb-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Universal Registration QR Code</h3>
              <div className="bg-white rounded-xl p-4 inline-block shadow-lg">
                <img src={universalQRCode} alt="Universal Registration QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Scan this code with another device or use the scanner below
              </p>
            </motion.div>
          )}

          {/* Scanner Area */}
          <div className="relative mb-8">
            {!scanning ? (
              <motion.div
                className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <SafeIcon icon={FiCamera} className="text-6xl text-gray-400 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-4">Position the universal QR code within the frame</p>
                  <div className="w-32 h-32 border-4 border-orange-400 rounded-lg mx-auto opacity-50"></div>
                </div>
              </motion.div>
            ) : (
              <div className="aspect-square bg-black rounded-2xl flex items-center justify-center relative overflow-hidden">
                {success ? (
                  <motion.div
                    className="text-center text-white z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <SafeIcon icon={FiCheck} className="text-6xl text-green-400 mb-4 mx-auto" />
                    <p className="text-xl font-semibold">{success}</p>
                  </motion.div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white z-10">
                        <motion.div
                          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p>Scanning for universal QR code...</p>
                        <p className="text-sm opacity-75 mt-2">Hold steady and keep the code in frame</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Scanning overlay */}
                <motion.div
                  className="absolute inset-4 border-2 border-white rounded-xl pointer-events-none"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Corner markers */}
                <div className="absolute top-8 left-8 w-6 h-6 border-t-4 border-l-4 border-orange-400 pointer-events-none"></div>
                <div className="absolute top-8 right-8 w-6 h-6 border-t-4 border-r-4 border-orange-400 pointer-events-none"></div>
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b-4 border-l-4 border-orange-400 pointer-events-none"></div>
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-4 border-r-4 border-orange-400 pointer-events-none"></div>
              </div>
            )}
          </div>

          {/* Hidden canvas for QR processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiAlertCircle} className="text-lg" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              onClick={handleDemoScan}
              disabled={scanning}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileHover={{ scale: scanning ? 1 : 1.02 }}
              whileTap={{ scale: scanning ? 1 : 0.98 }}
            >
              <SafeIcon icon={FiQrCode} className="text-xl" />
              {scanning ? 'Scanning in Progress...' : 'Demo Universal Registration'}
            </motion.button>

            <div className="flex gap-4">
              <motion.button
                onClick={startCamera}
                disabled={scanning}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-800 py-3 rounded-xl font-semibold hover:border-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: scanning ? 1 : 1.02 }}
              >
                <SafeIcon icon={FiCamera} className="text-lg" />
                Scan with Camera
              </motion.button>

              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={scanning}
                />
                <motion.div
                  className="w-full bg-white border-2 border-gray-300 text-gray-800 py-3 rounded-xl font-semibold hover:border-orange-400 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  whileHover={{ scale: scanning ? 1 : 1.02 }}
                >
                  <SafeIcon icon={FiUpload} className="text-lg" />
                  Upload Image
                </motion.div>
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">How to register universally:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Demo Registration:</strong> Try the universal registration instantly</li>
              <li>• <strong>Camera:</strong> Scan the universal QR code above</li>
              <li>• <strong>Upload:</strong> Select a photo containing the universal QR code</li>
              <li>• After scanning, you'll create one account that works for all restaurants</li>
              <li>• Access all restaurants from your dashboard after registration</li>
            </ul>
          </div>

          {/* Alternative Registration */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Prefer manual registration?{' '}
              <button
                onClick={() => navigate('/auth/signup')}
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Create account manually
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default QRRegistration