import { useMemo } from 'react';

export const useNoteFilters = (notes, { searchQuery = '', selectedCategory = 'All' }) => {
  return useMemo(() => {
    if (!Array.isArray(notes)) return [];
    
    return notes.filter(note => {
      // Filter by category if not 'All'
      if (selectedCategory !== 'All') {
        const noteCategory = note.category || '';
        if (noteCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }
      
      // Filter by search query if provided
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase();
        const title = (note.title || '').toLowerCase();
        const description = (note.description || '').toLowerCase();
        const category = (note.category || '').toLowerCase();
        
        // Check if search term exists in title, description, or category
        if (!title.includes(searchTerm) && 
            !description.includes(searchTerm) && 
            !category.includes(searchTerm)) {
          // Check tags if they exist
          if (Array.isArray(note.tags)) {
            const hasMatchingTag = note.tags.some(
              tag => tag && typeof tag === 'string' && 
              tag.toLowerCase().includes(searchTerm)
            );
            if (!hasMatchingTag) {
              return false;
            }
          } else {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [notes, searchQuery, selectedCategory]);
};
