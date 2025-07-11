import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useRestaurant } from '../../context/RestaurantContext'
import QRCode from 'qrcode'

const { FiArrowLeft, FiDownload, FiPrinter, FiQrCode, FiTable, FiUserPlus } = FiIcons

const QRCodeManager = () => {
  const navigate = useNavigate()
  const { restaurantId } = useParams()
  const { restaurants, getRestaurantById } = useRestaurant()
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantId || restaurants[0]?.id)
  const [qrCodes, setQrCodes] = useState({})
  const [registrationQRCodes, setRegistrationQRCodes] = useState({})
  const [generating, setGenerating] = useState(false)
  const [qrType, setQrType] = useState('menu') // 'menu' or 'registration'
  const canvasRef = useRef(null)

  const restaurant = getRestaurantById(selectedRestaurant)
  const tableCount = 20 // Default table count

  const generateQRCode = async (restaurantId, tableNumber, type = 'menu') => {
    try {
      let qrData
      if (type === 'registration') {
        qrData = `smart-restaurant-register:${restaurantId}:table:${tableNumber}`
      } else {
        qrData = `smart-restaurant:${restaurantId}:table:${tableNumber}`
      }
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code:', error)
      return null
    }
  }

  const generateAllQRCodes = async () => {
    if (!selectedRestaurant) return
    
    setGenerating(true)
    const menuCodes = {}
    const regCodes = {}
    
    for (let i = 1; i <= tableCount; i++) {
      const menuQR = await generateQRCode(selectedRestaurant, i, 'menu')
      const regQR = await generateQRCode(selectedRestaurant, i, 'registration')
      
      if (menuQR) menuCodes[i] = menuQR
      if (regQR) regCodes[i] = regQR
    }
    
    setQrCodes(menuCodes)
    setRegistrationQRCodes(regCodes)
    setGenerating(false)
  }

  const downloadQRCode = (tableNumber, type = 'menu') => {
    const codes = type === 'registration' ? registrationQRCodes : qrCodes
    const qrCode = codes[tableNumber]
    if (!qrCode) return

    const link = document.createElement('a')
    link.download = `${restaurant?.name || 'Restaurant'}-Table-${tableNumber}-${type.toUpperCase()}-QR.png`
    link.href = qrCode
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllQRCodes = () => {
    const codes = qrType === 'registration' ? registrationQRCodes : qrCodes
    Object.keys(codes).forEach(tableNumber => {
      setTimeout(() => downloadQRCode(parseInt(tableNumber), qrType), parseInt(tableNumber) * 100)
    })
  }

  const printQRCodes = () => {
    const codes = qrType === 'registration' ? registrationQRCodes : qrCodes
    const typeLabel = qrType === 'registration' ? 'Registration' : 'Menu'
    const actionText = qrType === 'registration' ? 'Scan to register & order' : 'Scan to view menu'
    
    const printWindow = window.open('', '_blank')
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${typeLabel} QR Codes - ${restaurant?.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .qr-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
          .qr-item { 
            text-align: center; 
            page-break-inside: avoid; 
            border: 1px solid #ddd; 
            padding: 15px; 
            border-radius: 8px; 
          }
          .qr-item img { width: 150px; height: 150px; }
          .qr-item h3 { margin: 10px 0 5px 0; }
          .qr-item p { margin: 0; color: #666; font-size: 14px; }
          .type-badge { 
            display: inline-block; 
            background: ${qrType === 'registration' ? '#10b981' : '#f59e0b'}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            margin-bottom: 8px; 
          }
          @media print { .qr-grid { grid-template-columns: repeat(2, 1fr); } }
        </style>
      </head>
      <body>
        <h1>${restaurant?.name} - ${typeLabel} QR Codes</h1>
        <div class="qr-grid">
          ${Object.entries(codes).map(([tableNumber, qrCode]) => `
            <div class="qr-item">
              <div class="type-badge">${typeLabel}</div>
              <img src="${qrCode}" alt="Table ${tableNumber} ${typeLabel} QR Code" />
              <h3>Table ${tableNumber}</h3>
              <p>${actionText}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  React.useEffect(() => {
    if (selectedRestaurant) {
      generateAllQRCodes()
    }
  }, [selectedRestaurant])

  const currentCodes = qrType === 'registration' ? registrationQRCodes : qrCodes

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate(restaurantId ? '/superadmin/restaurants' : '/superadmin')}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">QR Code Manager</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadAllQRCodes}
              disabled={Object.keys(currentCodes).length === 0}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiDownload} />
              Download All
            </button>
            <button
              onClick={printQRCodes}
              disabled={Object.keys(currentCodes).length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiPrinter} />
              Print All
            </button>
          </div>
        </motion.div>

        {/* Restaurant Selection */}
        {!restaurantId && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Select Restaurant
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            >
              {restaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.cuisine}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* QR Type Selection */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            QR Code Type
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => setQrType('menu')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                qrType === 'menu' 
                  ? 'border-orange-500 bg-orange-50 shadow-lg' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <SafeIcon icon={FiQrCode} className="text-2xl text-orange-600" />
                <h3 className="text-xl font-bold text-gray-800">Menu QR Codes</h3>
              </div>
              <p className="text-gray-600">Standard QR codes that take users directly to the menu</p>
            </motion.button>

            <motion.button
              onClick={() => setQrType('registration')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                qrType === 'registration' 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <SafeIcon icon={FiUserPlus} className="text-2xl text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Registration QR Codes</h3>
              </div>
              <p className="text-gray-600">Special QR codes that allow new users to register and order instantly</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Restaurant Info */}
        {restaurant && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
                <p className="text-gray-600">
                  {restaurant.cuisine} • {tableCount} Tables • {qrType === 'registration' ? 'Registration' : 'Menu'} QR Codes
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generate Button */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={generateAllQRCodes}
            disabled={generating || !selectedRestaurant}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-lg transition-all disabled:opacity-50"
          >
            <SafeIcon icon={qrType === 'registration' ? FiUserPlus : FiQrCode} className="text-xl" />
            {generating ? 'Generating QR Codes...' : `Regenerate All ${qrType === 'registration' ? 'Registration' : 'Menu'} QR Codes`}
          </button>
        </motion.div>

        {/* QR Codes Grid */}
        {Object.keys(currentCodes).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(currentCodes).map(([tableNumber, qrCode], index) => (
                <motion.div
                  key={tableNumber}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <SafeIcon icon={FiTable} className="text-xl text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-800">Table {tableNumber}</h3>
                    </div>
                    
                    {/* QR Type Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      qrType === 'registration' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {qrType === 'registration' ? 'Registration QR' : 'Menu QR'}
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <img 
                        src={qrCode} 
                        alt={`Table ${tableNumber} ${qrType} QR Code`}
                        className="w-full h-auto max-w-[200px] mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {qrType === 'registration' 
                        ? `Scan to register & order from ${restaurant?.name}` 
                        : `Scan to access ${restaurant?.name} menu`
                      }
                    </p>
                    <button
                      onClick={() => downloadQRCode(parseInt(tableNumber), qrType)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <SafeIcon icon={FiDownload} />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {generating && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Generating QR codes for all tables...</p>
          </motion.div>
        )}

        {/* Usage Instructions */}
        <motion.div 
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">QR Code Types & Usage</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <SafeIcon icon={FiQrCode} className="text-2xl text-orange-600" />
                <h4 className="text-xl font-bold text-gray-800">Menu QR Codes</h4>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Direct access to restaurant menu</li>
                <li>• Requires existing account or guest browsing</li>
                <li>• Standard table-based ordering</li>
                <li>• Best for returning customers</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <SafeIcon icon={FiUserPlus} className="text-2xl text-green-600" />
                <h4 className="text-xl font-bold text-gray-800">Registration QR Codes</h4>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Instant account creation and menu access</li>
                <li>• Perfect for new customers</li>
                <li>• Streamlined onboarding process</li>
                <li>• Account linked to restaurant for future visits</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default QRCodeManager