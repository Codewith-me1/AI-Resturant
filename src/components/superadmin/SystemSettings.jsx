import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowLeft, FiSave, FiSettings, FiDatabase, FiBell, FiShield, FiGlobe, FiMail } = FiIcons;

const SystemSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    system: {
      maintenanceMode: false,
      allowNewRegistrations: true,
      maxRestaurantsPerOwner: 3,
      sessionTimeout: 30, // minutes
      apiRateLimit: 1000, // requests per hour
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      adminAlerts: true,
      systemAlerts: true,
      maintenanceNotifications: true,
    },
    security: {
      twoFactorRequired: false,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15, // minutes
      sessionSecure: true,
    },
    integrations: {
      paymentGateway: 'stripe',
      emailProvider: 'sendgrid',
      smsProvider: 'twilio',
      analyticsProvider: 'google',
      backupEnabled: true,
      backupFrequency: 'daily',
    },
    branding: {
      appName: 'TasteMate',
      supportEmail: 'support@smartrestaurant.com',
      privacyPolicyUrl: 'https://smartrestaurant.com/privacy',
      termsOfServiceUrl: 'https://smartrestaurant.com/terms',
      logoUrl: '',
    }
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    alert('System settings saved successfully!');
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <div className="font-medium text-gray-800">{label}</div>
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/superadmin')}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <SafeIcon icon={FiSave} />
            Save Changes
          </button>
        </motion.div>

        <div className="space-y-8">
          {/* System Configuration */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiSettings} className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">System Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.system.maintenanceMode}
                onChange={(value) => updateSetting('system', 'maintenanceMode', value)}
                label="Maintenance Mode"
                description="Temporarily disable the system for maintenance"
              />
              <ToggleSwitch
                enabled={settings.system.allowNewRegistrations}
                onChange={(value) => updateSetting('system', 'allowNewRegistrations', value)}
                label="Allow New Registrations"
                description="Enable new restaurant owners to register"
              />
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Restaurants per Owner
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.system.maxRestaurantsPerOwner}
                    onChange={(e) => updateSetting('system', 'maxRestaurantsPerOwner', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.system.sessionTimeout}
                    onChange={(e) => updateSetting('system', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiShield} className="text-2xl text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.security.twoFactorRequired}
                onChange={(value) => updateSetting('security', 'twoFactorRequired', value)}
                label="Require Two-Factor Authentication"
                description="Force all users to enable 2FA"
              />
              <ToggleSwitch
                enabled={settings.security.passwordRequireSpecialChars}
                onChange={(value) => updateSetting('security', 'passwordRequireSpecialChars', value)}
                label="Require Special Characters in Passwords"
                description="Passwords must contain special characters"
              />
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Password Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lockout Duration (min)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiBell} className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Notification Settings</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.notifications.emailEnabled}
                  onChange={(value) => updateSetting('notifications', 'emailEnabled', value)}
                  label="Email Notifications"
                  description="Send notifications via email"
                />
                <ToggleSwitch
                  enabled={settings.notifications.smsEnabled}
                  onChange={(value) => updateSetting('notifications', 'smsEnabled', value)}
                  label="SMS Notifications"
                  description="Send notifications via SMS"
                />
                <ToggleSwitch
                  enabled={settings.notifications.pushEnabled}
                  onChange={(value) => updateSetting('notifications', 'pushEnabled', value)}
                  label="Push Notifications"
                  description="Send browser push notifications"
                />
              </div>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.notifications.adminAlerts}
                  onChange={(value) => updateSetting('notifications', 'adminAlerts', value)}
                  label="Admin Alerts"
                  description="Critical system alerts"
                />
                <ToggleSwitch
                  enabled={settings.notifications.systemAlerts}
                  onChange={(value) => updateSetting('notifications', 'systemAlerts', value)}
                  label="System Alerts"
                  description="System status notifications"
                />
                <ToggleSwitch
                  enabled={settings.notifications.maintenanceNotifications}
                  onChange={(value) => updateSetting('notifications', 'maintenanceNotifications', value)}
                  label="Maintenance Notifications"
                  description="Scheduled maintenance alerts"
                />
              </div>
            </div>
          </motion.div>

          {/* Integration Settings */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiGlobe} className="text-2xl text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Integration Settings</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Gateway
                </label>
                <select
                  value={settings.integrations.paymentGateway}
                  onChange={(e) => updateSetting('integrations', 'paymentGateway', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="square">Square</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Provider
                </label>
                <select
                  value={settings.integrations.emailProvider}
                  onChange={(e) => updateSetting('integrations', 'emailProvider', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="ses">Amazon SES</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.integrations.backupFrequency}
                  onChange={(e) => updateSetting('integrations', 'backupFrequency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="flex items-center">
                <ToggleSwitch
                  enabled={settings.integrations.backupEnabled}
                  onChange={(value) => updateSetting('integrations', 'backupEnabled', value)}
                  label="Automatic Backups"
                  description="Enable automatic data backups"
                />
              </div>
            </div>
          </motion.div>

          {/* Branding Settings */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiMail} className="text-2xl text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">Branding & Contact</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Name
                  </label>
                  <input
                    type="text"
                    value={settings.branding.appName}
                    onChange={(e) => updateSetting('branding', 'appName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.branding.supportEmail}
                    onChange={(e) => updateSetting('branding', 'supportEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Policy URL
                  </label>
                  <input
                    type="url"
                    value={settings.branding.privacyPolicyUrl}
                    onChange={(e) => updateSetting('branding', 'privacyPolicyUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms of Service URL
                  </label>
                  <input
                    type="url"
                    value={settings.branding.termsOfServiceUrl}
                    onChange={(e) => updateSetting('branding', 'termsOfServiceUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;