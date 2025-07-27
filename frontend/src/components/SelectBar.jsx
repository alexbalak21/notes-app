import * as React from "react"
import { Box } from "@mui/material"
import CategoryChip from "./CategoryChip"

/**
 * SelectBar Component
 * A reusable component that displays a list of selectable category chips with delete functionality
 * 
 * @param {Object} props - Component props
 * @param {string|number} [props.selectedCategory=0] - ID of the currently selected category (0 for 'All')
 * @param {Function} props.onCategoryChange - Callback when a category is selected
 * @param {Function} [props.onDeleteCategory] - Callback when a category is deleted
 * @param {Array<Object>} [props.categories=[{id: 0, name: 'All'}]] - Array of category objects with id, name, and color
 */
export default function SelectBar({ 
  selectedCategory = 0, 
  onCategoryChange, 
  onDeleteCategory,
  categories = [{ id: 0, name: 'All' }] 
}) {
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category.id);
    }
  };

  const handleDeleteCategory = (categoryId, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onDeleteCategory && categoryId !== 0) { // Prevent deleting 'All' category
      onDeleteCategory(categoryId);
    }
  };

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {categories.map((category) => (
        <Box key={category.id} mx={0.5} my={0.5}>
          <CategoryChip
            category={category.name}
            selected={selectedCategory === category.id}
            onClick={() => handleCategoryClick(category)}
            onDelete={onDeleteCategory ? (e) => handleDeleteCategory(category.id, e) : undefined}
            deletable={category.id !== 0} // Don't allow deleting 'All' category
            color={category.color}
          />
        </Box>
      ))}
    </Box>
  );
}
