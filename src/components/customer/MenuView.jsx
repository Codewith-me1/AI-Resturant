import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCustomer } from '../../context/CustomerContext';

const { FiArrowLeft, FiStar, FiPlus, FiMinus, FiShoppingCart, FiHeart, FiInfo, FiFilter, FiZap, FiSettings } = FiIcons;

const MenuView = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { getRestaurantById } = useRestaurant();
  const { addToOrder, currentOrder, getRecommendations, customerProfile } = useCustomer();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('recommended'); // recommended, price-low, price-high, name

  useEffect(() => {
    const restaurantData = getRestaurantById(restaurantId);
    setRestaurant(restaurantData);
  }, [restaurantId, getRestaurantById]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  let filteredMenu = selectedCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  // Apply sorting
  if (sortBy === 'recommended') {
    const recommendations = getRecommendations(filteredMenu);
    filteredMenu = recommendations.length > 0 ? recommendations : filteredMenu;
  } else if (sortBy === 'price-low') {
    filteredMenu = [...filteredMenu].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredMenu = [...filteredMenu].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredMenu = [...filteredMenu].sort((a, b) => a.name.localeCompare(b.name));
  }

  const recommendations = getRecommendations(restaurant.menu).slice(0, 3);
  const cartItemCount = currentOrder.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (item) => {
    addToOrder(item, 1);
  };

  const getSpiceLevelText = (level) => {
    const levels = ['Mild', 'Light', 'Medium', 'Spicy', 'Very Spicy', 'Extremely Hot'];
    return levels[level] || 'Mild';
  };

  const hasPreferences = () => {
    const prefs = customerProfile.preferences;
    return prefs.dietaryRestrictions.length > 0 || 
           prefs.allergens.length > 0 || 
           prefs.cuisinePreferences.length > 0 ||
           prefs.flavorProfiles?.length > 0 ||
           prefs.cookingMethods?.length > 0;
  };

  const ItemModal = ({ item, onClose }) => (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-64 object-cover rounded-t-3xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <SafeIcon icon={FiArrowLeft} className="text-gray-700" />
          </button>
          
          {/* Recommendation Score Badge */}
          {item.recommendationScore && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {item.recommendationScore}% Match
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
          <p className="text-gray-600 mb-4">{item.description}</p>
          
          {/* Match Reasons */}
          {item.matchReasons && item.matchReasons.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-800 mb-2">Why we recommend this:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {item.matchReasons.map((reason, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-orange-600">${item.price}</span>
            <div className="flex items-center gap-2">
              {item.spiceLevel > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  🌶️ {getSpiceLevelText(item.spiceLevel)}
                </span>
              )}
            </div>
          </div>

          {/* Nutrition Info */}
          {item.nutritionInfo && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-2">Nutrition (per serving)</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Calories: {item.nutritionInfo.calories}</div>
                <div>Protein: {item.nutritionInfo.protein}g</div>
                <div>Carbs: {item.nutritionInfo.carbs}g</div>
                <div>Fat: {item.nutritionInfo.fat}g</div>
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-red-800">Contains Allergens:</h4>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map(allergen => (
                  <span key={allergen} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm capitalize">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          <motion.button
            onClick={() => {
              handleAddToCart(item);
              onClose();
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiPlus} />
            Add to Order - ${item.price}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{restaurant.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <SafeIcon icon={FiStar} className="text-yellow-500" />
                  <span>{restaurant.rating}</span>
                  <span>•</span>
                  <span>{restaurant.cuisine}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Preferences Button */}
              <button
                onClick={() => navigate('/preferences')}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiSettings} className="text-sm" />
                Preferences
              </button>

              {cartItemCount > 0 && (
                <motion.button
                  className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/cart')}
                >
                  <SafeIcon icon={FiShoppingCart} />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                  ${cartTotal.toFixed(2)}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Preferences Notice */}
        {!hasPreferences() && (
          <motion.div 
            className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiZap} className="text-xl text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Get Personalized Recommendations!</h3>
                <p className="text-blue-700 text-sm">Set your food preferences to get AI-powered menu suggestions tailored just for you.</p>
              </div>
              <button
                onClick={() => navigate('/preferences')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Set Preferences
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        {showRecommendations && recommendations.length > 0 && hasPreferences() && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiZap} className="text-xl text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">AI Recommendations for You</h2>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  Based on your preferences
                </span>
              </div>
              <button
                onClick={() => setShowRecommendations(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map(item => (
                <motion.div 
                  key={item.id}
                  className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-4 border-2 border-orange-200"
                  whileHover={{ y: -2 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-orange-600">${item.price}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-orange-700">
                      ⭐ {Math.round(item.recommendationScore)}% match
                    </div>
                    {item.matchReasons && item.matchReasons.length > 0 && (
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Why?
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="recommended">AI Recommended</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <motion.div 
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => setSelectedItem(item)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <SafeIcon icon={FiInfo} className="text-gray-700 text-sm" />
                </button>
                
                {/* Recommendation Score Badge */}
                {item.recommendationScore && item.recommendationScore > 70 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {item.recommendationScore}% Match
                  </div>
                )}
                
                {item.spiceLevel > 0 && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    🌶️ {getSpiceLevelText(item.spiceLevel)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-600">${item.price}</span>
                  <div className="flex gap-2">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiPlus} />
                  Add to Order
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <motion.button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/cart')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="relative">
            <SafeIcon icon={FiShoppingCart} className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default MenuView;