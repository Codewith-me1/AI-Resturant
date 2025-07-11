import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRestaurant } from '../../context/RestaurantContext';

const { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiStore, FiStar, FiMenu, FiQrCode } = FiIcons;

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useRestaurant();
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    rating: 4.5,
    address: '',
    phone: '',
    email: '',
    description: ''
  });

  const handleSaveRestaurant = () => {
    const restaurantData = {
      ...newRestaurant,
      rating: parseFloat(newRestaurant.rating),
      menu: editingRestaurant ? editingRestaurant.menu : []
    };

    if (editingRestaurant) {
      updateRestaurant(editingRestaurant.id, restaurantData);
      setEditingRestaurant(null);
    } else {
      addRestaurant(restaurantData);
      setIsAddingRestaurant(false);
    }

    // Reset form
    setNewRestaurant({
      name: '',
      cuisine: '',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      rating: 4.5,
      address: '',
      phone: '',
      email: '',
      description: ''
    });
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
    setNewRestaurant({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      image: restaurant.image,
      rating: restaurant.rating.toString(),
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      description: restaurant.description || ''
    });
    setIsAddingRestaurant(true);
  };

  const handleDeleteRestaurant = (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      deleteRestaurant(restaurantId);
    }
  };

  const handleCancel = () => {
    setIsAddingRestaurant(false);
    setEditingRestaurant(null);
    setNewRestaurant({
      name: '',
      cuisine: '',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      rating: 4.5,
      address: '',
      phone: '',
      email: '',
      description: ''
    });
  };

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Thai', 
    'Mediterranean', 'American', 'French', 'Korean', 'Vietnamese', 'Greek'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/superadmin')}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
          </div>
          <button
            onClick={() => setIsAddingRestaurant(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <SafeIcon icon={FiPlus} />
            Add Restaurant
          </button>
        </motion.div>

        {/* Restaurants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 mb-2">{restaurant.cuisine} Cuisine</p>
                <div className="flex items-center gap-2 mb-4">
                  <SafeIcon icon={FiStar} className="text-yellow-500" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{restaurant.menu.length} items</span>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => navigate(`/superadmin/restaurant/${restaurant.id}/menu`)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiMenu} />
                    Menu
                  </button>
                  <button
                    onClick={() => navigate(`/superadmin/restaurant/${restaurant.id}/qr`)}
                    className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiQrCode} />
                    QR Codes
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRestaurant(restaurant)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                  >
                    <SafeIcon icon={FiEdit} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Restaurant Modal */}
      <AnimatePresence>
        {isAddingRestaurant && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl text-gray-700" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        value={newRestaurant.name}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter restaurant name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <select
                        value={newRestaurant.cuisine}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, cuisine: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select cuisine</option>
                        {cuisineOptions.map(cuisine => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRestaurant.description}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter restaurant description"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newRestaurant.phone}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newRestaurant.email}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="restaurant@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={newRestaurant.address}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Main Street, City, State 12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newRestaurant.rating}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={newRestaurant.image}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRestaurant}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <SafeIcon icon={FiSave} />
                      {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantManagement;