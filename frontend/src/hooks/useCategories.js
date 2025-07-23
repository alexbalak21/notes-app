import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Misc', color: '#9e9e9e' }
];

export const useCategories = () => {
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }]);
  const [categoryConfig, setCategoryConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.CATEGORIES);
      
      // Process API response
      const apiCategories = Array.isArray(response.data) 
        ? response.data.filter(cat => cat.name && cat.name.toLowerCase() !== 'all')
        : [];
      
      updateCategories(apiCategories);
      setError(null);
      return apiCategories;
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to default categories
      updateCategories(DEFAULT_CATEGORIES);
      setError(err.message);
      return DEFAULT_CATEGORIES;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new category
  const addCategory = async (categoryData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.CATEGORIES, categoryData);
      const newCategory = response.data;
      
      setCategories(prevCategories => {
        // Filter out 'All' and add the new category
        const updatedCategories = [
          { id: 'all', name: 'All' },
          ...prevCategories.filter(cat => cat.id !== 'all'),
          newCategory
        ];
        return updatedCategories;
      });
      
      // Update category config
      setCategoryConfig(prevConfig => ({
        ...prevConfig,
        [newCategory.name]: { color: newCategory.color }
      }));
      
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  // Update categories and config
  const updateCategories = (categoriesList) => {
    const categoriesWithAll = [
      { id: 'all', name: 'All' },
      ...categoriesList
    ];
    
    const newConfig = {};
    categoriesList.forEach(cat => {
      if (cat.name) {
        newConfig[cat.name] = { color: cat.color || '#9e9e9e' };
      }
    });
    
    setCategories(categoriesWithAll);
    setCategoryConfig(newConfig);
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    categoryConfig,
    isLoading,
    error,
    addCategory,
    refreshCategories: fetchCategories
  };
};
