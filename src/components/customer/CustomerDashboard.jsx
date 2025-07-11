import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCustomer } from '../../context/CustomerContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';

const { FiUser, FiSettings, FiHistory, FiStar, FiTrendingUp, FiZap, FiHeart, FiStore, FiQrCode, FiShoppingCart, FiMapPin, FiLogOut } = FiIcons;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { customerProfile, currentOrder } = useCustomer();
  const { restaurants } = useRestaurant();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const hasPreferences = () => {
    const prefs = customerProfile.preferences;
    return prefs.dietaryRestrictions.length > 0 || 
           prefs.allergens.length > 0 || 
           prefs.cuisinePreferences.length > 0 || 
           prefs.flavorProfiles?.length > 0 || 
           prefs.cookingMethods?.length > 0;
  };

  const getPreferenceSummary = () => {
    const prefs = customerProfile.preferences;
    const summary = [];
    
    if (prefs.dietaryRestrictions.length > 0) {
      summary.push(`${prefs.dietaryRestrictions.length} dietary preferences`);
    }
    if (prefs.cuisinePreferences.length > 0) {
      summary.push(`${prefs.cuisinePreferences.length} favorite cuisines`);
    }
    if (prefs.allergens.length > 0) {
      summary.push(`${prefs.allergens.length} allergens to avoid`);
    }
    
    return summary.length > 0 ? summary.join(', ') : 'No preferences set yet';
  };

  const handleRestaurantSelect = (restaurant) => {
    navigate(`/menu/${restaurant.id}`);
  };

  const cartItemCount = currentOrder.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile and Logout */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all shadow-sm"
          >
            <SafeIcon icon={FiLogOut} />
            <span>Sign Out</span>
          </button>
        </motion.div>

        {/* Profile and Quick Actions */}
        <motion.div
          className="flex flex-col lg:flex-row gap-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl lg:w-1/3">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiUser} className="text-3xl text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {user?.user_metadata?.name || 'Welcome!'}
              </h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                Customer Account
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl lg:w-2/3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                onClick={() => navigate('/scan')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiQrCode} className="text-2xl" />
                <span className="text-sm font-medium">QR Scanner</span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/preferences')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiSettings} className="text-2xl" />
                <span className="text-sm font-medium">Preferences</span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/orders')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiHistory} className="text-2xl" />
                <span className="text-sm font-medium">Order History</span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/cart')}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiShoppingCart} className="text-2xl" />
                <span className="text-sm font-medium">
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </span>
                {cartItemCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Preferences Status */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                hasPreferences() ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                <SafeIcon icon={hasPreferences() ? FiZap : FiHeart} className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {hasPreferences() ? 'AI Recommendations Active' : 'Setup Your Food Preferences'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {hasPreferences() 
                    ? getPreferenceSummary() 
                    : 'Get personalized menu recommendations based on your taste preferences'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {!hasPreferences() && (
                <button
                  onClick={() => navigate('/preferences')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Setup Now
                </button>
              )}
              {hasPreferences() && (
                <button
                  onClick={() => navigate('/preferences')}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {customerProfile.orderHistory.length}
            </div>
            <div className="text-gray-600">Orders Placed</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {restaurants.length}
            </div>
            <div className="text-gray-600">Available Restaurants</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {hasPreferences() ? '✓' : '○'}
            </div>
            <div className="text-gray-600">
              {hasPreferences() ? 'Preferences Set' : 'Setup Pending'}
            </div>
          </div>
        </motion.div>

        {/* All Restaurants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">All Restaurants</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <SafeIcon icon={FiStore} className="text-xl" />
              <span>{restaurants.length} restaurants available</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleRestaurantSelect(restaurant)}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine} Cuisine</p>
                  
                  {/* Restaurant Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <SafeIcon icon={FiStar} className="text-yellow-500" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span>•</span>
                      <span>{restaurant.menu.length} menu items</span>
                    </div>
                    
                    {restaurant.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <SafeIcon icon={FiMapPin} className="text-gray-400" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    <SafeIcon icon={FiStore} />
                    View Menu & Order
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current Cart Summary (if items in cart) */}
        {cartItemCount > 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <SafeIcon icon={FiShoppingCart} className="text-xl text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Current Cart</h3>
                  <p className="text-gray-600 text-sm">
                    {cartItemCount} item{cartItemCount > 1 ? 's' : ''} • ${cartTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/cart')}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View Cart
              </button>
            </div>
          </motion.div>
        )}

        {/* Preference Details (if preferences are set) */}
        {hasPreferences() && (
          <motion.div
            className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Your Food Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              {customerProfile.preferences.dietaryRestrictions.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Dietary Restrictions:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customerProfile.preferences.dietaryRestrictions.map(diet => (
                      <span key={diet} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs capitalize">
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {customerProfile.preferences.cuisinePreferences.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Favorite Cuisines:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customerProfile.preferences.cuisinePreferences.map(cuisine => (
                      <span key={cuisine} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {customerProfile.preferences.allergens.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Allergens to Avoid:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customerProfile.preferences.allergens.map(allergen => (
                      <span key={allergen} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs capitalize">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Spice Level:</span>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    {['None', 'Mild', 'Medium', 'Spicy', 'Very Spicy', 'Extremely Hot'][customerProfile.preferences.spiceLevel]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;