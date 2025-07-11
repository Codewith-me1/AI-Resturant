import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useRestaurant } from '../../context/RestaurantContext';

const { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiUpload } = FiIcons;

const MenuManagement = () => {
  const navigate = useNavigate();
  const { restaurants, addMenuItem, updateMenuItem, deleteMenuItem } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    tags: [],
    spiceLevel: 0,
    allergens: [],
    nutritionInfo: { calories: '', protein: '', carbs: '', fat: '' }
  });

  // Using the first restaurant for demo
  const restaurant = restaurants[0];
  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  const filteredMenu = selectedCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  const handleSaveItem = () => {
    const itemData = {
      ...newItem,
      price: parseFloat(newItem.price),
      nutritionInfo: {
        calories: parseInt(newItem.nutritionInfo.calories) || 0,
        protein: parseInt(newItem.nutritionInfo.protein) || 0,
        carbs: parseInt(newItem.nutritionInfo.carbs) || 0,
        fat: parseInt(newItem.nutritionInfo.fat) || 0
      }
    };

    if (editingItem) {
      updateMenuItem(restaurant.id, editingItem.id, itemData);
      setEditingItem(null);
    } else {
      addMenuItem(restaurant.id, itemData);
      setIsAddingItem(false);
    }

    // Reset form
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      tags: [],
      spiceLevel: 0,
      allergens: [],
      nutritionInfo: { calories: '', protein: '', carbs: '', fat: '' }
    });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      ...item,
      price: item.price.toString(),
      nutritionInfo: {
        calories: item.nutritionInfo.calories.toString(),
        protein: item.nutritionInfo.protein.toString(),
        carbs: item.nutritionInfo.carbs.toString(),
        fat: item.nutritionInfo.fat.toString()
      }
    });
    setIsAddingItem(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(restaurant.id, itemId);
    }
  };

  const handleCancel = () => {
    setIsAddingItem(false);
    setEditingItem(null);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      tags: [],
      spiceLevel: 0,
      allergens: [],
      nutritionInfo: { calories: '', protein: '', carbs: '', fat: '' }
    });
  };

  const toggleTag = (tag) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleAllergen = (allergen) => {
    setNewItem(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen) 
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const availableTags = ['vegetarian', 'vegan', 'spicy', 'sweet', 'italian', 'fresh', 'coffee'];
  const availableAllergens = ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/restaurant')}
              className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          </div>
          <button
            onClick={() => setIsAddingItem(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <SafeIcon icon={FiPlus} />
            Add Item
          </button>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-8">
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
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-600">${item.price}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {item.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                  >
                    <SafeIcon icon={FiEdit} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
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

      {/* Add/Edit Item Modal */}
      <AnimatePresence>
        {isAddingItem && (
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
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter item description"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                      <select
                        value={newItem.spiceLevel}
                        onChange={(e) => setNewItem(prev => ({ ...prev, spiceLevel: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value={0}>No Spice</option>
                        <option value={1}>Mild</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Spicy</option>
                        <option value={4}>Very Spicy</option>
                        <option value={5}>Extremely Hot</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            newItem.tags.includes(tag)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allergens */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
                    <div className="flex flex-wrap gap-2">
                      {availableAllergens.map(allergen => (
                        <button
                          key={allergen}
                          onClick={() => toggleAllergen(allergen)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            newItem.allergens.includes(allergen)
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {allergen}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nutrition Information</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <input
                        type="number"
                        placeholder="Calories"
                        value={newItem.nutritionInfo.calories}
                        onChange={(e) => setNewItem(prev => ({
                          ...prev,
                          nutritionInfo: { ...prev.nutritionInfo, calories: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Protein (g)"
                        value={newItem.nutritionInfo.protein}
                        onChange={(e) => setNewItem(prev => ({
                          ...prev,
                          nutritionInfo: { ...prev.nutritionInfo, protein: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Carbs (g)"
                        value={newItem.nutritionInfo.carbs}
                        onChange={(e) => setNewItem(prev => ({
                          ...prev,
                          nutritionInfo: { ...prev.nutritionInfo, carbs: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Fat (g)"
                        value={newItem.nutritionInfo.fat}
                        onChange={(e) => setNewItem(prev => ({
                          ...prev,
                          nutritionInfo: { ...prev.nutritionInfo, fat: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
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
                      onClick={handleSaveItem}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <SafeIcon icon={FiSave} />
                      {editingItem ? 'Update Item' : 'Add Item'}
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

export default MenuManagement;