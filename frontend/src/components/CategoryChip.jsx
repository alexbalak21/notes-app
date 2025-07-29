import {Chip, Box, styled, IconButton} from "@mui/material"
import { FaTimes as Close } from "react-icons/fa"

// Dot for category indication
const Dot = styled("span")(({color}) => ({
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: 6,
}))

// Styled Category Chip
const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "deletable" && prop !== "color",
})(({theme, selected, deletable, color}) => ({
  fontWeight: selected ? 600 : 400,
  padding: deletable ? "4px 26px 4px 16px" : "4px 16px",
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${selected ? "transparent" : theme.palette.divider}`,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  height: "auto",
  position: "relative",
  "&:hover": {
    transform: selected ? "translateY(-1px)" : "none",
    boxShadow: selected ? theme.shadows[1] : "none",
    "& .delete-button": {
      opacity: 0.7,
    },
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
  "& .MuiChip-label": {
    padding: "0",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "visible",
  },
  // Background color handling
  backgroundColor: selected ? `${color} !important` : theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],

  // Add shadow when selected
  boxShadow: selected ? theme.shadows[2] : "none",

  "&:hover": {
    backgroundColor: selected ? `${color} !important` : theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200],
    // Slightly elevate shadow on hover when selected
    boxShadow: selected ? theme.shadows[4] : "none",
    transform: selected ? "translateY(-1px)" : "none",
    "& .delete-button": {
      opacity: 0.7,
    },
  },
}))

/**
 * CategoryChip Component
 * A styled chip component for displaying categories with a colored dot
 *
 * @param {Object} props - Component props
 * @param {string} props.category - Category name to display
 * @param {string} props.color - Color for the category dot
 * @param {boolean} [props.selected=false] - Whether the chip is selected
 * @param {Function} [props.onClick] - Click handler for the chip
 * @param {Function} [props.onDelete] - Delete handler for the chip
 * @param {boolean} [props.deletable=false] - Whether the chip is deletable
 * @param {Object} [props.sx={}] - Additional styles to apply
 */
const CategoryChip = ({category, color, selected = false, onClick, onDelete, deletable = false, sx = {}}) => {
  const handleDelete = (e) => {
    e.stopPropagation()
    if (onDelete) onDelete(e)
  }

  return (
    <Box sx={{position: "relative", display: "inline-flex"}}>
      <StyledChip
        label={
          <Box display="flex" alignItems="center">
            <Dot color={color} />
            {category}
          </Box>
        }
        onClick={onClick}
        selected={selected}
        deletable={deletable}
        color={color}
        sx={{
          ...sx,
          "&:hover .delete-button": {
            opacity: 0.7,
          },
        }}
      />
      {deletable && (
        <IconButton
          size="small"
          className="delete-button"
          onClick={handleDelete}
          sx={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0,
            transition: "opacity 0.2s",
            padding: "4px",
            color: "inherit",
            backgroundColor: "transparent !important",
            "&:hover, &:focus-visible": {
              backgroundColor: "transparent !important",
              opacity: "0.7 !important",
            },
          }}>
          <Close fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}

export default CategoryChip
