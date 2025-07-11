import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRestaurant } from '../../context/RestaurantContext';
import ReactECharts from 'echarts-for-react';

const { FiArrowLeft, FiTrendingUp, FiUsers, FiDollarSign, FiStar, FiStore } = FiIcons;

const GlobalAnalytics = () => {
  const navigate = useNavigate();
  const { restaurants } = useRestaurant();

  // Sample global analytics data
  const globalRevenueData = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    legend: {
      data: restaurants.map(r => r.name),
      textStyle: { color: '#6b7280' }
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: restaurants.map((restaurant, index) => ({
      name: restaurant.name,
      type: 'line',
      data: [
        1200 + index * 200 + Math.random() * 500,
        1400 + index * 200 + Math.random() * 500,
        1100 + index * 200 + Math.random() * 500,
        1600 + index * 200 + Math.random() * 500,
        1800 + index * 200 + Math.random() * 500,
        1900 + index * 200 + Math.random() * 500
      ],
      smooth: true,
      lineStyle: { width: 3 },
      itemStyle: { color: `hsl(${index * 60}, 70%, 50%)` }
    }))
  };

  const restaurantPerformanceData = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    xAxis: {
      type: 'category',
      data: restaurants.map(r => r.name),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280', rotate: 45 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [{
      name: 'Revenue',
      type: 'bar',
      data: restaurants.map((r, index) => ({
        value: 15000 + index * 3000 + Math.random() * 5000,
        itemStyle: { color: `hsl(${index * 60}, 70%, 50%)` }
      }))
    }]
  };

  const globalStats = [
    {
      label: 'Total Revenue',
      value: '$' + (restaurants.length * 18500).toLocaleString(),
      change: '+12%',
      icon: FiDollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Total Restaurants',
      value: restaurants.length.toString(),
      change: '+2',
      icon: FiStore,
      color: 'text-blue-600'
    },
    {
      label: 'Total Orders',
      value: (restaurants.length * 1247).toLocaleString(),
      change: '+18%',
      icon: FiUsers,
      color: 'text-purple-600'
    },
    {
      label: 'Avg Rating',
      value: (restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1),
      change: '+0.1',
      icon: FiStar,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/superadmin')}
            className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Global Analytics</h1>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {globalStats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color}`} />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-1 gap-8 mb-8">
          {/* Global Revenue Chart */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Trends by Restaurant</h2>
            <ReactECharts option={globalRevenueData} style={{ height: '400px' }} />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Restaurant Performance */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Restaurant Performance</h2>
            <ReactECharts option={restaurantPerformanceData} style={{ height: '300px' }} />
          </motion.div>

          {/* Top Performing Restaurants */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Performing Restaurants</h2>
            <div className="space-y-4">
              {restaurants
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((restaurant, index) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                           style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}>
                        {index + 1}
                      </div>
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{restaurant.name}</div>
                        <div className="text-sm text-gray-600">{restaurant.cuisine}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiStar} className="text-yellow-500 text-sm" />
                        <span className="font-bold text-gray-800">{restaurant.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">{restaurant.menu.length} items</div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Restaurant Overview Grid */}
        <motion.div
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Restaurants Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Restaurant</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Cuisine</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Menu Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Est. Revenue</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant, index) => (
                  <tr key={restaurant.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-800">{restaurant.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{restaurant.cuisine}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiStar} className="text-yellow-500 text-sm" />
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{restaurant.menu.length}</td>
                    <td className="py-4 px-4 font-semibold text-green-600">
                      ${(15000 + index * 3000 + Math.random() * 5000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalAnalytics;