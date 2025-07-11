import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customerProfile, setCustomerProfile] = useState({
    name: '',
    preferences: {
      spiceLevel: 2, // 0-5 scale
      sweetness: 2, // 0-4 scale
      dietaryRestrictions: [],
      allergens: [],
      cuisinePreferences: [],
      mealTimePreferences: [],
      portionSize: 'medium', // small, medium, large
      flavorProfiles: [], // savory, sweet, sour, bitter, fresh, rich
      cookingMethods: [], // grilled, fried, steamed, roasted, raw, braised
      budgetRange: 'moderate', // budget, moderate, premium, no-preference
      healthGoal: 'general', // weight-loss, muscle-gain, heart-health, energy, general, none
      mealType: 'any' // breakfast, lunch, dinner, any
    },
    orderHistory: []
  });

  const [currentOrder, setCurrentOrder] = useState([]);

  const updatePreferences = (newPreferences) => {
    const updatedProfile = {
      ...customerProfile,
      preferences: { ...customerProfile.preferences, ...newPreferences }
    };
    setCustomerProfile(updatedProfile);
    localStorage.setItem('customerProfile', JSON.stringify(updatedProfile));
  };

  const addToOrder = (item, quantity = 1) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + quantity }
            : orderItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromOrder = (itemId) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== itemId));
  };

  const updateOrderQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    
    setCurrentOrder(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  const completeOrder = (orderData) => {
    const order = {
      id: Date.now().toString(),
      items: currentOrder,
      total: currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      timestamp: new Date().toISOString(),
      restaurant: orderData.restaurant,
      status: 'confirmed'
    };

    setCustomerProfile(prev => ({
      ...prev,
      orderHistory: [order, ...prev.orderHistory]
    }));

    clearOrder();
    return order;
  };

  // Enhanced AI-powered recommendation engine
  const getRecommendations = (menuItems) => {
    const { preferences } = customerProfile;

    return menuItems
      .map(item => {
        let score = 0;

        // Base score for all items
        score += 10;

        // Spice level matching (0-30 points)
        const spiceDiff = Math.abs(item.spiceLevel - preferences.spiceLevel);
        const spiceScore = Math.max(0, 30 - (spiceDiff * 6));
        score += spiceScore;

        // Sweetness preference for desserts (0-25 points)
        if (item.category === 'Dessert' && item.tags.includes('sweet')) {
          const sweetnessScore = preferences.sweetness * 5;
          score += sweetnessScore;
        }

        // Dietary restrictions (0-40 points)
        let dietaryBonus = 0;
        preferences.dietaryRestrictions.forEach(restriction => {
          if (item.tags.includes(restriction)) {
            dietaryBonus += 10;
          }
          // Special handling for diet types
          if (restriction === 'vegetarian' && !item.tags.includes('meat')) {
            dietaryBonus += 5;
          }
          if (restriction === 'vegan' && item.tags.includes('vegan')) {
            dietaryBonus += 15;
          }
          if (restriction === 'gluten-free' && !item.allergens.includes('gluten')) {
            dietaryBonus += 8;
          }
          if (restriction === 'keto' && item.tags.includes('low-carb')) {
            dietaryBonus += 12;
          }
          if (restriction === 'high-protein' && item.nutritionInfo.protein > 20) {
            dietaryBonus += 8;
          }
        });
        score += Math.min(dietaryBonus, 40);

        // Allergen penalties (-50 points for each allergen)
        const hasAllergens = preferences.allergens.some(allergen =>
          item.allergens.includes(allergen)
        );
        if (hasAllergens) {
          score -= 50; // Heavy penalty for allergens
        }

        // Cuisine preferences (0-20 points)
        const matchingCuisine = preferences.cuisinePreferences.some(cuisine =>
          item.tags.includes(cuisine.toLowerCase()) || 
          item.category.toLowerCase().includes(cuisine.toLowerCase())
        );
        if (matchingCuisine) {
          score += 20;
        }

        // Flavor profile matching (0-30 points)
        let flavorScore = 0;
        preferences.flavorProfiles.forEach(profile => {
          if (item.tags.includes(profile)) {
            flavorScore += 6;
          }
          // Special flavor mappings
          if (profile === 'savory' && (item.tags.includes('umami') || item.category === 'Main Course')) {
            flavorScore += 4;
          }
          if (profile === 'fresh' && (item.tags.includes('salad') || item.tags.includes('raw'))) {
            flavorScore += 6;
          }
          if (profile === 'rich' && (item.tags.includes('cream') || item.tags.includes('cheese'))) {
            flavorScore += 5;
          }
        });
        score += Math.min(flavorScore, 30);

        // Cooking method preferences (0-20 points)
        let cookingScore = 0;
        preferences.cookingMethods.forEach(method => {
          if (item.tags.includes(method)) {
            cookingScore += 5;
          }
          // Method-specific mappings
          if (method === 'grilled' && item.tags.includes('bbq')) {
            cookingScore += 3;
          }
          if (method === 'fried' && item.tags.includes('crispy')) {
            cookingScore += 3;
          }
          if (method === 'steamed' && item.tags.includes('healthy')) {
            cookingScore += 4;
          }
        });
        score += Math.min(cookingScore, 20);

        // Budget considerations (0-15 points)
        if (preferences.budgetRange !== 'no-preference') {
          if (preferences.budgetRange === 'budget' && item.price < 15) {
            score += 15;
          } else if (preferences.budgetRange === 'moderate' && item.price >= 15 && item.price <= 30) {
            score += 15;
          } else if (preferences.budgetRange === 'premium' && item.price > 30) {
            score += 15;
          }
        }

        // Health goal alignment (0-25 points)
        let healthScore = 0;
        const nutrition = item.nutritionInfo;
        
        switch (preferences.healthGoal) {
          case 'weight-loss':
            if (nutrition.calories < 400) healthScore += 15;
            if (nutrition.fat < 15) healthScore += 5;
            if (item.tags.includes('light')) healthScore += 5;
            break;
          case 'muscle-gain':
            if (nutrition.protein > 25) healthScore += 20;
            if (nutrition.protein > 20) healthScore += 10;
            break;
          case 'heart-health':
            if (nutrition.fat < 20) healthScore += 10;
            if (item.tags.includes('omega-3')) healthScore += 10;
            if (!item.tags.includes('fried')) healthScore += 5;
            break;
          case 'energy':
            if (nutrition.carbs > 30 && nutrition.carbs < 60) healthScore += 15;
            if (nutrition.protein > 15) healthScore += 10;
            break;
          case 'general':
            if (nutrition.calories < 600) healthScore += 10;
            if (item.tags.includes('balanced')) healthScore += 15;
            break;
        }
        score += healthScore;

        // Meal time preferences (0-15 points)
        if (preferences.mealTimePreferences && preferences.mealTimePreferences.length > 0) {
          const currentHour = new Date().getHours();
          let mealTimeScore = 0;
          
          preferences.mealTimePreferences.forEach(mealTime => {
            if (mealTime === 'breakfast' && currentHour >= 6 && currentHour < 11) {
              if (item.category === 'Breakfast' || item.tags.includes('morning')) {
                mealTimeScore += 15;
              }
            } else if (mealTime === 'lunch' && currentHour >= 11 && currentHour < 16) {
              if (item.category === 'Main Course' || item.tags.includes('lunch')) {
                mealTimeScore += 15;
              }
            } else if (mealTime === 'dinner' && currentHour >= 17) {
              if (item.category === 'Main Course' || item.tags.includes('dinner')) {
                mealTimeScore += 15;
              }
            } else if (mealTime === 'snacks') {
              if (item.category === 'Appetizer' || item.tags.includes('snack')) {
                mealTimeScore += 10;
              }
            }
          });
          
          score += Math.min(mealTimeScore, 15);
        }

        // Order history bonus (0-15 points)
        let historyBonus = 0;
        customerProfile.orderHistory.forEach(order => {
          order.items.forEach(orderItem => {
            if (orderItem.id === item.id) {
              historyBonus += 5; // Liked this item before
            }
            // Similar items bonus
            if (orderItem.category === item.category) {
              historyBonus += 2;
            }
            if (orderItem.tags.some(tag => item.tags.includes(tag))) {
              historyBonus += 1;
            }
          });
        });
        score += Math.min(historyBonus, 15);

        // Portion size consideration (0-10 points)
        if (preferences.portionSize === 'small' && item.tags.includes('light')) {
          score += 10;
        } else if (preferences.portionSize === 'large' && item.tags.includes('hearty')) {
          score += 10;
        } else if (preferences.portionSize === 'medium') {
          score += 5; // Neutral bonus for medium
        }

        // Popularity boost (0-10 points)
        // Simulate popularity based on rating or common tags
        if (item.tags.includes('popular') || item.tags.includes('signature')) {
          score += 10;
        }

        // Time of day adjustments
        const currentHour = new Date().getHours();
        if (currentHour < 11 && item.category === 'Dessert') {
          score -= 10; // Less likely to want dessert in the morning
        }
        if (currentHour > 18 && item.category === 'Appetizer') {
          score += 5; // More likely to want appetizers in the evening
        }

        return { 
          ...item, 
          recommendationScore: Math.max(0, Math.round(score)),
          matchReasons: getMatchReasons(item, preferences, score)
        };
      })
      .filter(item => item.recommendationScore > 20) // Only show items with decent scores
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  // Helper function to explain why items are recommended
  const getMatchReasons = (item, preferences, score) => {
    const reasons = [];
    
    if (Math.abs(item.spiceLevel - preferences.spiceLevel) <= 1) {
      reasons.push('Perfect spice level match');
    }
    
    if (preferences.dietaryRestrictions.some(diet => item.tags.includes(diet))) {
      reasons.push('Matches your dietary preferences');
    }
    
    if (preferences.cuisinePreferences.some(cuisine => 
      item.tags.includes(cuisine.toLowerCase()))) {
      reasons.push('Your favorite cuisine');
    }
    
    if (preferences.flavorProfiles.some(flavor => item.tags.includes(flavor))) {
      reasons.push('Matches your flavor preferences');
    }
    
    if (customerProfile.orderHistory.some(order => 
      order.items.some(orderItem => orderItem.id === item.id))) {
      reasons.push('You\'ve enjoyed this before');
    }
    
    return reasons;
  };

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('customerProfile');
    if (savedProfile) {
      try {
        setCustomerProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Failed to load customer profile:', error);
      }
    }
  }, []);

  // Save current order to localStorage
  useEffect(() => {
    localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  }, [currentOrder]);

  // Load saved order on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        setCurrentOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error('Failed to load current order:', error);
      }
    }
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customerProfile,
        setCustomerProfile,
        updatePreferences,
        currentOrder,
        addToOrder,
        removeFromOrder,
        updateOrderQuantity,
        clearOrder,
        completeOrder,
        getRecommendations
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};