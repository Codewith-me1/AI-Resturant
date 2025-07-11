import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ReactECharts from 'echarts-for-react';

const { FiArrowLeft, FiTrendingUp, FiUsers, FiDollarSign, FiStar } = FiIcons;

const Analytics = () => {
  const navigate = useNavigate();

  // Sample data for analytics
  const revenueData = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      lineStyle: { color: '#f97316', width: 3 },
      itemStyle: { color: '#f97316' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(249, 115, 22, 0.3)' },
            { offset: 1, color: 'rgba(249, 115, 22, 0.05)' }
          ]
        }
      }
    }]
  };

  const popularItemsData = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    series: [{
      name: 'Popular Items',
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 35, name: 'Margherita Pizza', itemStyle: { color: '#f97316' } },
        { value: 25, name: 'Arrabbiata Pasta', itemStyle: { color: '#ea580c' } },
        { value: 20, name: 'Caesar Salad', itemStyle: { color: '#dc2626' } },
        { value: 12, name: 'Tiramisu', itemStyle: { color: '#b91c1c' } },
        { value: 8, name: 'Others', itemStyle: { color: '#991b1b' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const orderTrendsData = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    legend: {
      data: ['Orders', 'Customers'],
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
    series: [
      {
        name: 'Orders',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110],
        itemStyle: { color: '#f97316' }
      },
      {
        name: 'Customers',
        type: 'bar',
        data: [100, 160, 120, 65, 55, 90],
        itemStyle: { color: '#ea580c' }
      }
    ]
  };

  const stats = [
    { label: 'Total Revenue', value: '$12,847', change: '+15%', icon: FiDollarSign, color: 'text-green-600' },
    { label: 'Total Orders', value: '1,247', change: '+8%', icon: FiTrendingUp, color: 'text-blue-600' },
    { label: 'Customers', value: '892', change: '+12%', icon: FiUsers, color: 'text-purple-600' },
    { label: 'Avg Rating', value: '4.8', change: '+0.2', icon: FiStar, color: 'text-yellow-600' }
  ];

  const topItems = [
    { name: 'Margherita Pizza', orders: 127, revenue: '$2,286' },
    { name: 'Spicy Arrabbiata Pasta', orders: 98, revenue: '$1,663' },
    { name: 'Caesar Salad', orders: 76, revenue: '$987' },
    { name: 'Tiramisu', orders: 54, revenue: '$486' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/restaurant')}
            className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color}`} />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Revenue</h2>
            <ReactECharts option={revenueData} style={{ height: '300px' }} />
          </motion.div>

          {/* Popular Items Chart */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Menu Items</h2>
            <ReactECharts option={popularItemsData} style={{ height: '300px' }} />
          </motion.div>
        </div>

        {/* Order Trends and Top Items */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Trends */}
          <motion.div
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Trends</h2>
            <ReactECharts option={orderTrendsData} style={{ height: '300px' }} />
          </motion.div>

          {/* Top Items List */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Selling Items</h2>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.orders} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{item.revenue}</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Customer Insights */}
        <motion.div
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">68%</div>
              <div className="text-gray-700">Repeat Customers</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.2</div>
              <div className="text-gray-700">Avg Order Value</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">23min</div>
              <div className="text-gray-700">Avg Prep Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;