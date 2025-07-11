import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCustomer } from '../../context/CustomerContext';
import { format } from 'date-fns';

const { FiArrowLeft, FiClock, FiCheck, FiStar, FiRepeat } = FiIcons;

const OrderHistory = () => {
  const navigate = useNavigate();
  const { customerProfile, addToOrder } = useCustomer();

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToOrder(item, item.quantity);
    });
    navigate(`/menu/${order.restaurant.id}`);
  };

  if (customerProfile.orderHistory.length === 0) {
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
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          </motion.div>

          {/* Empty State */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SafeIcon icon={FiClock} className="text-6xl text-gray-400 mb-6 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">Start exploring our menu to place your first order!</p>
            <button
              onClick={() => navigate('/scan')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Browse Menu
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {customerProfile.orderHistory.map((order, index) => (
            <motion.div
              key={order.id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{order.restaurant.name}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(order.timestamp), 'MMM dd, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-green-600 font-medium">{order.status}</div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleReorder(order)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <SafeIcon icon={FiRepeat} />
                  Reorder
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <SafeIcon icon={FiStar} />
                  Rate
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;