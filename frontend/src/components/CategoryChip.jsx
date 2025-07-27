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

/**
 * CategoryChip Component
 * A styled chip component for displaying categories with a colored dot
 * 
 * @param {Object} props - Component props
 * @param {string} props.category - Category name to display
 * @param {string} props.color - Color for the category dot
 * @param {boolean} [props.selected=false] - Whether the chip is selected
 * @param {Function} [props.onClick] - Click handler for the chip
 * @param {Object} [props.sx={}] - Additional styles to apply
 */
const CategoryChip = ({ 
  category, 
  color,
  selected = false, 
  onClick,
  sx = {}
}) => {
  return (
    <StyledChip
      label={
        <Box display="flex" alignItems="center">
          <Dot color={color} />
          {category}
        </Box>
      }
      size="small"
      onClick={onClick}
      selected={selected}
      sx={{
        ...sx,
        backgroundColor: selected ? color : undefined,
        '&:hover': {
          backgroundColor: selected 
            ? (theme) => {
                try {
                  return theme.palette.augmentColor({ color: { main: color } }).dark;
                } catch {
                  return color;
                }
              }
            : undefined,
        },
      }}
    />
  );
};

export default CategoryChip;
