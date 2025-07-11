import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const { FiHome, FiMenu, FiBarChart3, FiSettings, FiUsers, FiTrendingUp, FiDollarSign, FiStar, FiLogOut } = FiIcons;

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardItems = [
    {
      title: 'Menu Management',
      description: 'Add, edit, and organize your menu items',
      icon: FiMenu,
      color: 'from-blue-500 to-purple-500',
      action: () => navigate('/restaurant/menu')
    },
    {
      title: 'Analytics',
      description: 'View customer insights and order analytics',
      icon: FiBarChart3,
      color: 'from-green-500 to-teal-500',
      action: () => navigate('/restaurant/analytics')
    },
    {
      title: 'Settings',
      description: 'Configure restaurant settings and preferences',
      icon: FiSettings,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/restaurant/settings')
    }
  ];

  const stats = [
    { label: 'Today\'s Orders', value: '47', icon: FiUsers, color: 'text-blue-600' },
    { label: 'Revenue', value: '$1,247', icon: FiDollarSign, color: 'text-green-600' },
    { label: 'Avg Rating', value: '4.8', icon: FiStar, color: 'text-yellow-600' },
    { label: 'Growth', value: '+12%', icon: FiTrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-4xl font-bold text-gray-800">Restaurant Dashboard</h1>
              <p className="text-xl text-gray-600">Manage your restaurant operations</p>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Recent Activity */}
        <motion.div
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New order received', time: '2 minutes ago', type: 'order' },
              { action: 'Menu item updated', time: '15 minutes ago', type: 'menu' },
              { action: 'Customer review posted', time: '1 hour ago', type: 'review' },
              { action: 'Daily report generated', time: '3 hours ago', type: 'report' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'menu' ? 'bg-blue-500' :
                    activity.type === 'review' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`} />
                  <span className="font-medium text-gray-800">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-600">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;