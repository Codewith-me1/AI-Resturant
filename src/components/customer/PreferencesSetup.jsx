import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCustomer } from '../../context/CustomerContext';

const { FiArrowLeft, FiSave, FiUser, FiHeart, FiAlertTriangle, FiChefHat, FiClock, FiTrendingUp } = FiIcons;

const PreferencesSetup = () => {
  const navigate = useNavigate();
  const { customerProfile, updatePreferences } = useCustomer();
  const [preferences, setPreferences] = useState(customerProfile.preferences);

  const spiceLevels = [
    { value: 0, label: 'No Spice', emoji: '😊', description: 'I prefer no heat at all' },
    { value: 1, label: 'Mild', emoji: '🌶️', description: 'Just a tiny bit of warmth' },
    { value: 2, label: 'Medium', emoji: '🌶️🌶️', description: 'Moderate spice level' },
    { value: 3, label: 'Spicy', emoji: '🌶️🌶️🌶️', description: 'I enjoy spicy food' },
    { value: 4, label: 'Very Spicy', emoji: '🔥', description: 'Bring on the heat!' },
    { value: 5, label: 'Extremely Hot', emoji: '🔥🔥', description: 'The spicier, the better!' }
  ];

  const sweetnessLevels = [
    { value: 0, label: 'No Sweet', emoji: '😐', description: 'I avoid sweet foods' },
    { value: 1, label: 'Lightly Sweet', emoji: '🍯', description: 'Just a hint of sweetness' },
    { value: 2, label: 'Moderately Sweet', emoji: '🍯🍯', description: 'Balanced sweetness' },
    { value: 3, label: 'Very Sweet', emoji: '🍰', description: 'I love sweet treats' },
    { value: 4, label: 'Extremely Sweet', emoji: '🍰🍰', description: 'The sweeter, the better!' }
  ];

  const mealTimes = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅', description: 'Light morning meals' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️', description: 'Midday favorites' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙', description: 'Evening dining' },
    { value: 'snacks', label: 'Snacks', emoji: '🍿', description: 'Quick bites anytime' },
    { value: 'any', label: 'Any Time', emoji: '🕐', description: 'No time preference' }
  ];

  const portionSizes = [
    { value: 'small', label: 'Small', emoji: '🥄', description: 'Light portions' },
    { value: 'medium', label: 'Medium', emoji: '🍽️', description: 'Regular portions' },
    { value: 'large', label: 'Large', emoji: '🍖', description: 'Generous portions' }
  ];

  const flavorProfiles = [
    { value: 'savory', label: 'Savory', emoji: '🧂', description: 'Rich, umami flavors' },
    { value: 'sweet', label: 'Sweet', emoji: '🍯', description: 'Sweet and dessert-like' },
    { value: 'sour', label: 'Sour/Tangy', emoji: '🍋', description: 'Citrusy and tart' },
    { value: 'bitter', label: 'Bitter', emoji: '☕', description: 'Coffee, dark chocolate' },
    { value: 'fresh', label: 'Fresh', emoji: '🌿', description: 'Light and refreshing' },
    { value: 'rich', label: 'Rich', emoji: '🧈', description: 'Creamy and indulgent' }
  ];

  const cookingMethods = [
    { value: 'grilled', label: 'Grilled', emoji: '🔥', description: 'Charred and smoky' },
    { value: 'fried', label: 'Fried', emoji: '🍳', description: 'Crispy and golden' },
    { value: 'steamed', label: 'Steamed', emoji: '💨', description: 'Light and healthy' },
    { value: 'roasted', label: 'Roasted', emoji: '🔥', description: 'Caramelized flavors' },
    { value: 'raw', label: 'Raw/Fresh', emoji: '🥗', description: 'Uncooked and natural' },
    { value: 'braised', label: 'Braised', emoji: '🍲', description: 'Slow-cooked and tender' }
  ];

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 
    'low-carb', 'low-fat', 'high-protein', 'halal', 'kosher', 'pescatarian'
  ];

  const allergenOptions = [
    'nuts', 'dairy', 'eggs', 'gluten', 'soy', 'shellfish', 
    'fish', 'sesame', 'peanuts', 'tree nuts'
  ];

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Thai', 
    'Mediterranean', 'American', 'French', 'Korean', 'Vietnamese', 'Greek',
    'Middle Eastern', 'Spanish', 'Lebanese', 'Ethiopian', 'Moroccan'
  ];

  const budgetRanges = [
    { value: 'budget', label: 'Budget-Friendly', emoji: '💰', description: 'Under $15 per meal' },
    { value: 'moderate', label: 'Moderate', emoji: '💰💰', description: '$15-30 per meal' },
    { value: 'premium', label: 'Premium', emoji: '💰💰💰', description: '$30+ per meal' },
    { value: 'no-preference', label: 'No Preference', emoji: '🤷', description: 'Price doesn\'t matter' }
  ];

  const healthGoals = [
    { value: 'weight-loss', label: 'Weight Loss', emoji: '⚖️', description: 'Lower calorie options' },
    { value: 'muscle-gain', label: 'Muscle Gain', emoji: '💪', description: 'High protein foods' },
    { value: 'heart-health', label: 'Heart Health', emoji: '❤️', description: 'Low sodium, healthy fats' },
    { value: 'energy', label: 'More Energy', emoji: '⚡', description: 'Balanced nutrition' },
    { value: 'general', label: 'General Health', emoji: '🌟', description: 'Overall wellness' },
    { value: 'none', label: 'No Specific Goal', emoji: '😊', description: 'Just enjoying food' }
  ];

  const handleSave = () => {
    updatePreferences(preferences);
    navigate(-1);
  };

  const toggleArrayItem = (array, item) => {
    return array.includes(item) 
      ? array.filter(i => i !== item) 
      : [...array, item];
  };

  const updateNestedPreference = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

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
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiUser} className="text-2xl text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">Food Preferences</h1>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Spice Level */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiChefHat} className="text-xl text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">Spice Preference</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spiceLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => setPreferences(prev => ({ ...prev, spiceLevel: level.value }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.spiceLevel === level.value
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                  }`}
                >
                  <div className="text-2xl mb-2">{level.emoji}</div>
                  <div className="font-medium text-gray-800">{level.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sweetness Level */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiHeart} className="text-xl text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Sweetness Preference</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sweetnessLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => setPreferences(prev => ({ ...prev, sweetness: level.value }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.sweetness === level.value
                      ? 'border-pink-500 bg-pink-50 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{level.emoji}</div>
                  <div className="font-medium text-gray-800">{level.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Meal Time Preferences */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiClock} className="text-xl text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Preferred Meal Times</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mealTimes.map(meal => (
                <button
                  key={meal.value}
                  onClick={() => setPreferences(prev => ({ 
                    ...prev, 
                    mealTimePreferences: toggleArrayItem(prev.mealTimePreferences || [], meal.value)
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    (preferences.mealTimePreferences || []).includes(meal.value)
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{meal.emoji}</div>
                  <div className="font-medium text-gray-800">{meal.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{meal.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Portion Size */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferred Portion Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {portionSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => setPreferences(prev => ({ ...prev, portionSize: size.value }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.portionSize === size.value
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{size.emoji}</div>
                  <div className="font-medium text-gray-800">{size.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{size.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Flavor Profiles */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Favorite Flavor Profiles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {flavorProfiles.map(flavor => (
                <button
                  key={flavor.value}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    flavorProfiles: toggleArrayItem(prev.flavorProfiles || [], flavor.value)
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    (preferences.flavorProfiles || []).includes(flavor.value)
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{flavor.emoji}</div>
                  <div className="font-medium text-gray-800">{flavor.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{flavor.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Cooking Methods */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferred Cooking Methods</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cookingMethods.map(method => (
                <button
                  key={method.value}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    cookingMethods: toggleArrayItem(prev.cookingMethods || [], method.value)
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    (preferences.cookingMethods || []).includes(method.value)
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.emoji}</div>
                  <div className="font-medium text-gray-800">{method.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Budget Preference */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Budget Preference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetRanges.map(budget => (
                <button
                  key={budget.value}
                  onClick={() => setPreferences(prev => ({ ...prev, budgetRange: budget.value }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.budgetRange === budget.value
                      ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{budget.emoji}</div>
                  <div className="font-medium text-gray-800">{budget.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{budget.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Health Goals */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Health Goals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthGoals.map(goal => (
                <button
                  key={goal.value}
                  onClick={() => setPreferences(prev => ({ ...prev, healthGoal: goal.value }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.healthGoal === goal.value
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.emoji}</div>
                  <div className="font-medium text-gray-800">{goal.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{goal.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Dietary Restrictions */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Dietary Restrictions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dietaryOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    dietaryRestrictions: toggleArrayItem(prev.dietaryRestrictions, option)
                  }))}
                  className={`p-3 rounded-xl border-2 transition-all capitalize ${
                    preferences.dietaryRestrictions.includes(option)
                      ? 'border-green-500 bg-green-50 text-green-800 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Allergens */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiAlertTriangle} className="text-xl text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">Allergens to Avoid</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {allergenOptions.map(allergen => (
                <button
                  key={allergen}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    allergens: toggleArrayItem(prev.allergens, allergen)
                  }))}
                  className={`p-3 rounded-xl border-2 transition-all capitalize ${
                    preferences.allergens.includes(allergen)
                      ? 'border-red-500 bg-red-50 text-red-800 shadow-lg'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Cuisine Preferences */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Favorite Cuisines</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cuisineOptions.map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    cuisinePreferences: toggleArrayItem(prev.cuisinePreferences, cuisine)
                  }))}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    preferences.cuisinePreferences.includes(cuisine)
                      ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <SafeIcon icon={FiSave} className="text-xl" />
            Save Preferences & Get Personalized Recommendations
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSetup;