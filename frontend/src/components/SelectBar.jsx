import * as React from "react"
import { Box } from "@mui/material"
import CategoryChip from "./CategoryChip"

/**
 * SelectBar Component
 * A reusable component that displays a list of selectable category chips
 * 
 * @param {Object} props - Component props
 * @param {string} [props.selectedCategory="All"] - Currently selected category name
 * @param {Function} props.onCategoryChange - Callback when a category is selected
 * @param {Array<Object>} [props.categories=[{id: 'all', name: 'All'}]] - Array of category objects with id and name
 */
export default function SelectBar({ 
  selectedCategory = "All", 
  onCategoryChange, 
  categories = [{ id: 'all', name: 'All' }] 
}) {
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category.name);
    }
  };

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {categories.map((category) => (
        <Box key={category.id} mx={0.5} my={0.5}>
          <CategoryChip
            category={category.name}
            selected={selectedCategory === category.name}
            onClick={() => handleCategoryClick(category)}
            color={category.color}
          />
        </Box>
      ))}
    </Box>
  );
}
