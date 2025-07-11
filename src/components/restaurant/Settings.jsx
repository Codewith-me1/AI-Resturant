import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowLeft, FiSave, FiUpload, FiBell, FiGlobe, FiClock, FiDollarSign } = FiIcons;

const Settings = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    restaurantName: 'Bella Vista Italian',
    description: 'Authentic Italian cuisine with a modern twist',
    cuisine: 'Italian',
    phone: '+1 (555) 123-4567',
    email: 'info@bellavista.com',
    address: '123 Main Street, City, State 12345',
    operatingHours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    },
    notifications: {
      newOrders: true,
      lowStock: true,
      reviews: true,
      promotions: false
    },
    pricing: {
      currency: 'USD',
      taxRate: 8.5,
      serviceCharge: 0
    }
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/restaurant')}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Restaurant Settings</h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <SafeIcon icon={FiSave} />
            Save Changes
          </button>
        </motion.div>

        <div className="space-y-8">
          {/* Basic Information */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                <input
                  type="text"
                  value={settings.restaurantName}
                  onChange={(e) => updateSetting('restaurantName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                <select
                  value={settings.cuisine}
                  onChange={(e) => updateSetting('cuisine', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => updateSetting('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => updateSetting('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Operating Hours */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiClock} className="text-2xl text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">Operating Hours</h2>
            </div>
            <div className="space-y-4">
              {days.map(day => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-gray-50 rounded-xl">
                  <div className="font-medium text-gray-800 capitalize">{day}</div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!settings.operatingHours[day].closed}
                      onChange={(e) => updateSetting(`operatingHours.${day}.closed`, !e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                  {!settings.operatingHours[day].closed && (
                    <>
                      <input
                        type="time"
                        value={settings.operatingHours[day].open}
                        onChange={(e) => updateSetting(`operatingHours.${day}.open`, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="time"
                        value={settings.operatingHours[day].close}
                        onChange={(e) => updateSetting(`operatingHours.${day}.close`, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiBell} className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-800 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {key === 'newOrders' && 'Get notified when new orders arrive'}
                      {key === 'lowStock' && 'Alert when inventory is running low'}
                      {key === 'reviews' && 'Notify about new customer reviews'}
                      {key === 'promotions' && 'Updates about promotional opportunities'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSetting(`notifications.${key}`, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Settings */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiDollarSign} className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Pricing Settings</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.pricing.currency}
                  onChange={(e) => updateSetting('pricing.currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.pricing.taxRate}
                  onChange={(e) => updateSetting('pricing.taxRate', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.pricing.serviceCharge}
                  onChange={(e) => updateSetting('pricing.serviceCharge', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* QR Code Management */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiGlobe} className="text-2xl text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">QR Code Management</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Table QR Codes</h3>
                <p className="text-gray-600 mb-4">Generate and manage QR codes for your tables</p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Generate QR Codes
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu URL</h3>
                <p className="text-gray-600 mb-2">Your digital menu URL:</p>
                <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                  https://smartrestaurant.app/menu/rest1
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;