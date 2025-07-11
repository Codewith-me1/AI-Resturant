import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRestaurant } from '../context/RestaurantContext';
import jsQR from 'jsqr';

const { FiCamera, FiUpload, FiArrowLeft, FiCheck, FiAlertCircle } = FiIcons;

const QRScanner = ({ onRestaurantFound }) => {
  const navigate = useNavigate();
  const { getRestaurantById } = useRestaurant();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const processQRCode = (qrData) => {
    try {
      // Handle different QR code formats
      let restaurantId, tableNumber;
      
      if (qrData.startsWith('smart-restaurant:')) {
        // New format: smart-restaurant:restaurantId:table:tableNumber
        const parts = qrData.split(':');
        restaurantId = parts[1];
        tableNumber = parts[3];
      } else if (qrData.startsWith('restaurant:')) {
        // Legacy format: restaurant:restaurantId:table:tableNumber
        const parts = qrData.split(':');
        restaurantId = parts[1];
        tableNumber = parts[3];
      } else if (qrData.includes('menu')) {
        // URL format: https://domain.com/menu/restaurantId or similar
        const urlMatch = qrData.match(/menu\/([^/\?]+)/);
        if (urlMatch) {
          restaurantId = urlMatch[1];
        }
      } else {
        // Try to parse as direct restaurant ID
        restaurantId = qrData;
      }

      if (restaurantId) {
        const restaurant = getRestaurantById(restaurantId);
        if (restaurant) {
          setSuccess(`Connected to ${restaurant.name}!`);
          onRestaurantFound(restaurant);
          setTimeout(() => {
            navigate(`/menu/${restaurantId}?table=${tableNumber || '1'}`);
          }, 1500);
          return true;
        }
      }
      
      setError('Restaurant not found. Please check the QR code.');
      return false;
    } catch (err) {
      setError('Invalid QR code format.');
      return false;
    }
  };

  const handleDemoScan = () => {
    setScanning(true);
    setError('');
    
    // Simulate scanning delay
    setTimeout(() => {
      const demoQRData = 'smart-restaurant:rest1:table:5';
      processQRCode(demoQRData);
      setScanning(false);
    }, 2000);
  };

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
      stopCamera();
      if (processQRCode(code.data)) {
        setScanning(false);
      } else {
        setTimeout(() => {
          setScanning(false);
          setError('');
        }, 3000);
      }
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Start scanning loop
        scanIntervalRef.current = setInterval(scanQRCode, 500);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or use Demo Scan.');
      setScanning(false);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setScanning(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          if (processQRCode(code.data)) {
            setScanning(false);
          } else {
            setTimeout(() => {
              setScanning(false);
              setError('');
            }, 3000);
          }
        } else {
          setError('No QR code found in the image.');
          setScanning(false);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Scan QR Code</h1>
        </motion.div>

        {/* Scanner Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-800">
              <SafeIcon icon={FiAlertCircle} className="text-lg" />
              <span className="font-medium">QR Scanner Ready</span>
            </div>
            <p className="text-blue-700 mt-1 text-sm">
              Scan a restaurant QR code or use "Demo Scan" to try the sample restaurant
            </p>
          </div>

          {/* Scanner Area */}
          <div className="relative mb-8">
            {!scanning ? (
              <motion.div 
                className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <SafeIcon icon={FiCamera} className="text-6xl text-gray-400 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-4">Position QR code within the frame</p>
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
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white z-10">
                        <motion.div
                          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p>Scanning for QR code...</p>
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
              <SafeIcon icon={FiCamera} className="text-xl" />
              {scanning ? 'Scanning in Progress...' : 'Demo Scan'}
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
            <h3 className="font-semibold text-gray-800 mb-2">How to scan:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Demo Scan:</strong> Try the sample restaurant instantly</li>
              <li>• <strong>Camera:</strong> Point at any restaurant QR code for real-time scanning</li>
              <li>• <strong>Upload:</strong> Select a photo containing a QR code</li>
              <li>• Make sure the QR code is clearly visible and well-lit</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRScanner;