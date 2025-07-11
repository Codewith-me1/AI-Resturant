import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck, FiHome, FiClock, FiMapPin } = FiIcons;

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <SafeIcon icon={FiCheck} className="text-4xl text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Thank you for your order. We're preparing it now!
          </motion.p>
        </motion.div>

        {/* Order Details */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order #{order.id.slice(-6)}</h2>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
              {order.status}
            </span>
          </div>

          {/* Restaurant Info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
            <SafeIcon icon={FiMapPin} className="text-xl text-gray-600" />
            <div>
              <div className="font-semibold text-gray-800">{order.restaurant.name}</div>
              <div className="text-sm text-gray-600">Table Service</div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
            <SafeIcon icon={FiClock} className="text-xl text-blue-600" />
            <div>
              <div className="font-semibold text-gray-800">Estimated Time</div>
              <div className="text-sm text-gray-600">15-25 minutes</div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Items Ordered</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
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

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Total</span>
              <span className="text-green-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Track Your Order
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border-2 border-gray-300 text-gray-800 py-4 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiHome} />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;