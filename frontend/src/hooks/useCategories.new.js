import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Misc', color: '#9e9e9e' }
];

export const useCategories = () => {
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.CATEGORIES);
      
      if (Array.isArray(response.data)) {
        setCategories([
          { id: 'all', name: 'All' },
          ...response.data
        ]);
        setError(null);
        return response.data;
      }
      throw new Error('Invalid categories data received');
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([{ id: 'all', name: 'All' }, ...DEFAULT_CATEGORIES]);
      setError(err.response?.data?.error || err.message);
      return DEFAULT_CATEGORIES;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new category
  const addCategory = async (categoryData) => {
    try {
      if (!categoryData.name) {
        throw new Error('Name is required');
      }
      
      const response = await axios.post(API_ENDPOINTS.CATEGORIES, {
        name: categoryData.name,
        color: categoryData.color || '#9e9e9e'
      });
      
      const newCategory = response.data;
      
      setCategories(prevCategories => [
        ...prevCategories.filter(cat => cat.id !== 'all'),
        newCategory,
        { id: 'all', name: 'All' }
      ]);
      
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Update a category
  const updateCategory = async (categoryId, updates) => {
    try {
      if (!categoryId) throw new Error('Category ID is required');
      
      const response = await axios.put(
        `${API_ENDPOINTS.CATEGORIES}/${categoryId}`, 
        updates
      );
      
      const updatedCategory = response.data;
      
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId ? updatedCategory : cat
        )
      );
      
      return updatedCategory;
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Delete a category
  const deleteCategory = async (categoryId) => {
    try {
      if (!categoryId) throw new Error('Category ID is required');
      
      await axios.delete(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`);
      
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== categoryId)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Get category by ID
  const getCategoryById = useCallback((id) => {
    if (!id) return null;
    return categories.find(cat => cat.id === id || cat.id === parseInt(id));
  }, [categories]);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    refreshCategories: fetchCategories
  };
};
