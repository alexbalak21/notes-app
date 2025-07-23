import { Chip, Box, styled } from "@mui/material";

// Dot for category indication
const Dot = styled("span")(({ color }) => ({
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: 6,
}));

// Styled Category Chip
const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  fontWeight: selected ? 600 : 400,
  padding: '0 12px',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${selected ? 'transparent' : theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: selected ? 'translateY(-1px)' : 'none',
    boxShadow: selected ? theme.shadows[1] : 'none',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  '& .MuiChip-label': {
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center',
  },
  // Default unselected state
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.grey[800] 
    : theme.palette.grey[100],
  '&:hover:not(.Mui-selected)': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.grey[700]
      : theme.palette.grey[200],
  },
}));

// Default category colors if none provided
const DEFAULT_CATEGORY_COLORS = {
  'All': '#9e9e9e',
  'Home': '#FFA726',
  'Work': '#42A5F5',
  'Personal': '#66BB6A',
  'default': '#9E9E9E'
};

/**
 * CategoryChip Component
 * A styled chip component for displaying categories with optional color
 * 
 * @param {Object} props - Component props
 * @param {string} [props.category='All'] - Category name to display
 * @param {boolean} [props.selected=false] - Whether the chip is selected
 * @param {Function} [props.onClick] - Click handler for the chip
 * @param {Object} [props.sx={}] - Additional styles to apply
 * @param {string} [props.color] - Custom color for the category dot (overrides default)
 */
const CategoryChip = ({ 
  category = 'All', 
  selected = false, 
  onClick,
  sx = {},
  color: customColor
}) => {
  // Use custom color if provided, otherwise use default from mapping, or fallback gray
  const color = customColor || DEFAULT_CATEGORY_COLORS[category] || '#9E9E9E';
  
  return (
    <StyledChip
      label={
        <Box display="flex" alignItems="center">
          <Dot color={color} />
          {category}
        </Box>
      }
      size="small"
      // Remove the color prop to prevent MUI from trying to use theme colors
      onClick={onClick}
      selected={selected}
      sx={{
        ...sx,
        // Apply background color directly in sx to avoid MUI color prop issues
        backgroundColor: selected ? color : undefined,
        '&:hover': {
          backgroundColor: selected 
            ? (theme) => {
                try {
                  return theme.palette.augmentColor({ color: { main: color } }).dark;
                } catch {
                  // Fallback if augmentColor fails
                  return color;
                }
              }
            : undefined,
        },
      }}
      colorprop={color} // Custom prop to pass to styled component
    />
  );
};

export default CategoryChip;
