import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaTimes } from 'react-icons/fa';

const CategoryManager = ({ categories, setCategories, fetchNotes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setTargetCategoryId('');
    setError('');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setError('');
    
    try {
      const response = await axios.delete(`/api/categories/${categoryToDelete.id}`, {
        data: { targetCategoryId: targetCategoryId || null }
      });
      
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      if (error.response?.data?.error?.includes('associated notes')) {
        setCategoryToDelete({
          ...categoryToDelete,
          noteCount: error.response.data.noteCount
        });
      } else {
        setError(error.response?.data?.error || 'Failed to delete category');
        setIsModalOpen(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      await axios.delete(`/api/categories/${categoryToDelete.id}`, {
        data: { targetCategoryId: targetCategoryId || null }
      });
      
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="category-manager" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Manage Categories</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(category => (
          <li 
            key={category.id} 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              margin: '0.5rem 0',
              backgroundColor: '#fff',
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ flex: 1, fontSize: '1rem' }}>{category.name}</span>
            <button
              onClick={() => handleDeleteClick(category)}
              disabled={category.id === 1}
              style={{
                background: 'none',
                border: 'none',
                color: category.id === 1 ? '#ccc' : '#ff4d4f',
                cursor: category.id === 1 ? 'not-allowed' : 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}
              title={category.id === 1 ? 'Cannot delete default category' : 'Delete category'}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0 }}>
                {categoryToDelete?.noteCount 
                  ? "Category Has Associated Notes" 
                  : "Delete Category"}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setCategoryToDelete(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: '#666'
                }}
              >
                <FaTimes />
              </button>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                color: '#ff4d4f',
                padding: '0.75rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {categoryToDelete?.noteCount ? (
              <div>
                <p>This category has {categoryToDelete.noteCount} associated notes. What would you like to do?</p>
                <div style={{ margin: '1.25rem 0' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#333'
                  }}>
                    Move all notes to:
                  </label>
                  <select
                    value={targetCategoryId}
                    onChange={(e) => setTargetCategoryId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                      fontSize: '1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories
                      .filter(cat => cat.id !== categoryToDelete.id)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <p style={{ 
                  color: '#ff4d4f', 
                  marginTop: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  <strong>Warning:</strong> This action cannot be undone.
                </p>
              </div>
            ) : (
              <p style={{ marginBottom: '1.5rem' }}>
                Are you sure you want to delete the category "{categoryToDelete?.name}"?
              </p>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #eee'
            }}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCategoryToDelete(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#333'
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={categoryToDelete?.noteCount ? handleConfirmDelete : handleDeleteCategory}
                disabled={isDeleting || (categoryToDelete?.noteCount && !targetCategoryId)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#ff4d4f',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  opacity: (isDeleting || (categoryToDelete?.noteCount && !targetCategoryId)) ? 0.7 : 1,
                  pointerEvents: (isDeleting || (categoryToDelete?.noteCount && !targetCategoryId)) ? 'none' : 'auto'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
