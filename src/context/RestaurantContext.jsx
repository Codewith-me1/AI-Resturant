import React, { createContext, useContext, useState, useEffect } from 'react';

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([
    {
      id: 'rest1',
      name: 'Bella Vista Italian',
      cuisine: 'Italian',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      rating: 4.8,
      address: '123 Main Street, Downtown',
      phone: '+1 (555) 123-4567',
      email: 'info@bellavista.com',
      description: 'Authentic Italian cuisine with a modern twist',
      menu: [
        {
          id: 'item1',
          name: 'Margherita Pizza',
          description: 'Fresh tomatoes, mozzarella, basil, olive oil',
          price: 18.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          tags: ['vegetarian', 'italian'],
          spiceLevel: 0,
          allergens: ['gluten', 'dairy'],
          nutritionInfo: { calories: 320, protein: 12, carbs: 45, fat: 11 }
        },
        {
          id: 'item2',
          name: 'Spicy Arrabbiata Pasta',
          description: 'Penne pasta in spicy tomato sauce with garlic and chili',
          price: 16.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
          tags: ['spicy', 'italian', 'vegetarian'],
          spiceLevel: 3,
          allergens: ['gluten'],
          nutritionInfo: { calories: 380, protein: 14, carbs: 52, fat: 8 }
        },
        {
          id: 'item3',
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee and mascarpone',
          price: 8.99,
          category: 'Dessert',
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
          tags: ['sweet', 'italian', 'coffee'],
          spiceLevel: 0,
          allergens: ['dairy', 'eggs', 'gluten'],
          nutritionInfo: { calories: 450, protein: 6, carbs: 35, fat: 32 }
        },
        {
          id: 'item4',
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce, parmesan cheese, croutons, caesar dressing',
          price: 12.99,
          category: 'Appetizer',
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
          tags: ['fresh', 'vegetarian'],
          spiceLevel: 0,
          allergens: ['dairy', 'eggs', 'gluten'],
          nutritionInfo: { calories: 180, protein: 8, carbs: 12, fat: 12 }
        }
      ]
    },
    {
      id: 'rest2',
      name: 'Dragon Palace Chinese',
      cuisine: 'Chinese',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      rating: 4.6,
      address: '456 Oak Avenue, Chinatown',
      phone: '+1 (555) 987-6543',
      email: 'orders@dragonpalace.com',
      description: 'Traditional Chinese cuisine with fresh ingredients',
      menu: [
        {
          id: 'chinese1',
          name: 'Kung Pao Chicken',
          description: 'Spicy stir-fried chicken with peanuts and vegetables',
          price: 15.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
          tags: ['spicy', 'chinese', 'chicken'],
          spiceLevel: 4,
          allergens: ['nuts', 'soy'],
          nutritionInfo: { calories: 420, protein: 28, carbs: 18, fat: 26 }
        },
        {
          id: 'chinese2',
          name: 'Sweet and Sour Pork',
          description: 'Crispy pork with pineapple in sweet and sour sauce',
          price: 17.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400',
          tags: ['sweet', 'chinese', 'pork'],
          spiceLevel: 1,
          allergens: ['gluten'],
          nutritionInfo: { calories: 380, protein: 22, carbs: 35, fat: 18 }
        }
      ]
    },
    {
      id: 'rest3',
      name: 'Spice Route Indian',
      cuisine: 'Indian',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      rating: 4.7,
      address: '789 Curry Lane, Little India',
      phone: '+1 (555) 456-7890',
      email: 'hello@spiceroute.com',
      description: 'Authentic Indian flavors and aromatic spices',
      menu: [
        {
          id: 'indian1',
          name: 'Butter Chicken',
          description: 'Tender chicken in creamy tomato-based curry',
          price: 16.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400',
          tags: ['indian', 'chicken', 'curry'],
          spiceLevel: 2,
          allergens: ['dairy'],
          nutritionInfo: { calories: 450, protein: 32, carbs: 12, fat: 28 }
        },
        {
          id: 'indian2',
          name: 'Vegetable Biryani',
          description: 'Fragrant basmati rice with mixed vegetables and spices',
          price: 14.99,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400',
          tags: ['vegetarian', 'indian', 'rice'],
          spiceLevel: 2,
          allergens: [],
          nutritionInfo: { calories: 320, protein: 8, carbs: 62, fat: 6 }
        }
      ]
    }
  ]);

  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const getRestaurantById = (id) => {
    return restaurants.find(restaurant => restaurant.id === id);
  };

  const addRestaurant = (restaurantData) => {
    const newRestaurant = {
      ...restaurantData,
      id: 'rest' + Date.now(),
      menu: restaurantData.menu || []
    };
    setRestaurants(prev => [...prev, newRestaurant]);
    return newRestaurant;
  };

  const updateRestaurant = (restaurantId, updatedData) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? { ...restaurant, ...updatedData }
          : restaurant
      )
    );
  };

  const deleteRestaurant = (restaurantId) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== restaurantId));
  };

  const addMenuItem = (restaurantId, item) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              menu: [...restaurant.menu, { ...item, id: Date.now().toString() }]
            }
          : restaurant
      )
    );
  };

  const updateMenuItem = (restaurantId, itemId, updatedItem) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              menu: restaurant.menu.map(item =>
                item.id === itemId ? { ...item, ...updatedItem } : item
              )
            }
          : restaurant
      )
    );
  };

  const deleteMenuItem = (restaurantId, itemId) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              menu: restaurant.menu.filter(item => item.id !== itemId)
            }
          : restaurant
      )
    );
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        currentRestaurant,
        setCurrentRestaurant,
        getRestaurantById,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};