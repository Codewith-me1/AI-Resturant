import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiUser, FiMail, FiPhone, FiShield } = FiIcons;

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      id: 'user1',
      name: 'John Smith',
      email: 'john@bellavista.com',
      phone: '+1 (555) 123-4567',
      role: 'restaurant_owner',
      restaurantId: 'rest1',
      restaurantName: 'Bella Vista Italian',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-12-01T00:00:00Z'
    },
    {
      id: 'user2',
      name: 'Maria Garcia',
      email: 'maria@dragongarden.com',
      phone: '+1 (555) 234-5678',
      role: 'restaurant_owner',
      restaurantId: 'rest2',
      restaurantName: 'Dragon Garden',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2023-11-15T00:00:00Z'
    },
    {
      id: 'user3',
      name: 'Carlos Rodriguez',
      email: 'carlos@tacofiesta.com',
      phone: '+1 (555) 345-6789',
      role: 'restaurant_owner',
      restaurantId: 'rest3',
      restaurantName: 'Taco Fiesta',
      status: 'inactive',
      lastLogin: '2024-01-10T09:20:00Z',
      createdAt: '2023-10-20T00:00:00Z'
    },
    {
      id: 'user4',
      name: 'Admin User',
      email: 'admin@smartrestaurant.com',
      phone: '+1 (555) 000-0000',
      role: 'super_admin',
      restaurantId: null,
      restaurantName: null,
      status: 'active',
      lastLogin: '2024-01-15T12:00:00Z',
      createdAt: '2023-01-01T00:00:00Z'
    }
  ]);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'restaurant_owner',
    restaurantId: '',
    status: 'active'
  });

  const roles = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'restaurant_owner', label: 'Restaurant Owner', color: 'bg-blue-100 text-blue-800' },
    { value: 'manager', label: 'Manager', color: 'bg-green-100 text-green-800' },
    { value: 'staff', label: 'Staff', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleSaveUser = () => {
    const userData = {
      ...newUser,
      id: editingUser ? editingUser.id : `user${Date.now()}`,
      lastLogin: editingUser ? editingUser.lastLogin : null,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
    };

    if (editingUser) {
      setUsers(prev => prev.map(user => user.id === editingUser.id ? userData : user));
      setEditingUser(null);
    } else {
      setUsers(prev => [...prev, userData]);
      setIsAddingUser(false);
    }

    // Reset form
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'restaurant_owner',
      restaurantId: '',
      status: 'active'
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      restaurantId: user.restaurantId || '',
      status: user.status
    });
    setIsAddingUser(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleCancel = () => {
    setIsAddingUser(false);
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'restaurant_owner',
      restaurantId: '',
      status: 'active'
    });
  };

  const getRoleInfo = (role) => {
    return roles.find(r => r.value === role) || roles[1];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          </div>
          <button
            onClick={() => setIsAddingUser(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <SafeIcon icon={FiPlus} />
            Add User
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiUser} className="text-2xl text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{users.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Users</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiShield} className="text-2xl text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'super_admin').length}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Super Admins</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiUser} className="text-2xl text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {users.filter(u => u.role === 'restaurant_owner').length}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Restaurant Owners</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiUser} className="text-2xl text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 'active').length}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Active Users</p>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Restaurant</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Last Login</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <motion.tr 
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <SafeIcon icon={FiMail} className="text-xs" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <SafeIcon icon={FiPhone} className="text-xs" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {user.restaurantName ? (
                          <div className="text-sm text-gray-600">{user.restaurantName}</div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiEdit} className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {isAddingUser && (
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
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl text-gray-700" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {newUser.role === 'restaurant_owner' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant ID
                      </label>
                      <input
                        type="text"
                        value={newUser.restaurantId}
                        onChange={(e) => setNewUser(prev => ({ ...prev, restaurantId: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="rest1, rest2, etc."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUser}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <SafeIcon icon={FiSave} />
                      {editingUser ? 'Update User' : 'Add User'}
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

export default UserManagement;