import * as React from "react"
import { Box } from "@mui/material"
import CategoryChip from "./CategoryChip"

// Categories with label and color
const categories = ["All", "Home", "Work", "Personal"]

export default function SelectBar({ selectedCategory = "All", onCategoryChange }) {
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {categories.map((category) => (
        <Box key={category} mx={0.5} my={0.5}>
          <CategoryChip
            category={category}
            selected={selectedCategory === category}
            onClick={() => handleCategoryClick(category)}
          />
        </Box>
      ))}
    </Box>
  );
}
