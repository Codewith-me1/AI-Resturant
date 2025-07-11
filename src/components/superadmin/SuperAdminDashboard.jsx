import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';

const { FiHome, FiUsers, FiStore, FiBarChart3, FiSettings, FiTrendingUp, FiDollarSign, FiStar, FiShield, FiQrCode, FiLogOut } = FiIcons;

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { restaurants } = useRestaurant();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardItems = [
    {
      title: 'Manage Restaurants',
      description: 'Add, edit, and manage all restaurants',
      icon: FiStore,
      color: 'from-blue-500 to-purple-500',
      action: () => navigate('/superadmin/restaurants')
    },
    {
      title: 'User Management',
      description: 'Manage restaurant owners and admin users',
      icon: FiUsers,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/superadmin/users')
    },
    {
      title: 'Global Analytics',
      description: 'View analytics across all restaurants',
      icon: FiBarChart3,
      color: 'from-green-500 to-teal-500',
      action: () => navigate('/superadmin/analytics')
    },
    {
      title: 'QR Code Manager',
      description: 'Generate and manage QR codes for all restaurants',
      icon: FiQrCode,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/superadmin/qr-manager')
    },
    {
      title: 'System Settings',
      description: 'Configure global system settings and security',
      icon: FiShield,
      color: 'from-red-500 to-pink-500',
      action: () => navigate('/superadmin/settings')
    },
    {
      title: 'Platform Settings',
      description: 'Configure platform-wide settings and preferences',
      icon: FiSettings,
      color: 'from-gray-500 to-gray-600',
      action: () => navigate('/superadmin/platform-settings')
    }
  ];

  const stats = [
    { label: 'Total Restaurants', value: restaurants.length.toString(), icon: FiStore, color: 'text-blue-600' },
    { label: 'Total Menu Items', value: restaurants.reduce((sum, r) => sum + r.menu.length, 0).toString(), icon: FiUsers, color: 'text-green-600' },
    { label: 'Avg Rating', value: (restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1), icon: FiStar, color: 'text-yellow-600' },
    { label: 'Active QR Codes', value: (restaurants.length * 10).toString(), icon: FiTrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout Button */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiHome} className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Super Admin Dashboard</h1>
              <p className="text-xl text-gray-600">Manage all restaurants and operations</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all shadow-sm"
          >
            <SafeIcon icon={FiLogOut} />
            <span>Sign Out</span>
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {dashboardItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={item.action}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <SafeIcon icon={item.icon} className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Restaurant Overview */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Restaurant Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiStar} className="text-yellow-500 text-sm" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{restaurant.menu.length} items</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;