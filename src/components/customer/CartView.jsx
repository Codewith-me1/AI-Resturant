import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCustomer } from '../../context/CustomerContext';

const { FiArrowLeft, FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiCheck } = FiIcons;

const CartView = () => {
  const navigate = useNavigate();
  const { 
    currentOrder, 
    addToOrder, 
    removeFromOrder, 
    updateOrderQuantity, 
    clearOrder, 
    completeOrder 
  } = useCustomer();

  const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId);
    } else {
      updateOrderQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (currentOrder.length === 0) return;

    const orderData = {
      restaurant: {
        id: 'rest1', // This should come from the current restaurant context
        name: 'Current Restaurant'
      }
    };

    const order = completeOrder(orderData);
    
    // Navigate to order confirmation
    navigate('/order-confirmation', { state: { order } });
  };

  if (currentOrder.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          </motion.div>

          {/* Empty Cart */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SafeIcon icon={FiShoppingCart} className="text-6xl text-gray-400 mb-6 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Continue Shopping
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
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          </div>
          
          <button
            onClick={clearOrder}
            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
          >
            <SafeIcon icon={FiTrash2} />
            Clear Cart
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {currentOrder.map((item, index) => (
              <motion.div 
                key={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      {item.spiceLevel > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          🌶️ Spicy
                        </span>
                      )}
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600 mb-3">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <SafeIcon icon={FiMinus} className="text-sm" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="text-sm" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromOrder(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1 mx-auto"
                    >
                      <SafeIcon icon={FiTrash2} className="text-xs" />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl sticky top-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiCheck} className="text-xl" />
                Proceed to Checkout
              </motion.button>

              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{currentOrder.length} item{currentOrder.length > 1 ? 's' : ''}</div>
                  <div>Estimated time: 15-25 minutes</div>
                  <div>Pickup or table service available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;