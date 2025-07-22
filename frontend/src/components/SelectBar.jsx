import * as React from "react"
import {Box, Chip} from "@mui/material"
import {styled} from "@mui/material/styles"

// Dot for category indication
const Dot = styled("span")(({color}) => ({
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: 6,
}))

// Styled Chip that takes backgroundColor dynamically and handles dark mode
const StyledChip = styled(Chip)(({theme, customcolor}) => {
  const isDark = theme.palette.mode === 'dark';
  const defaultBg = isDark ? theme.palette.grey[800] : theme.palette.grey[100];
  const hoverBg = isDark ? theme.palette.grey[700] : theme.palette.grey[200];
  
  return {
    margin: theme.spacing(0.5),
    backgroundColor: customcolor || defaultBg,
    color: customcolor 
      ? theme.palette.getContrastText(customcolor) 
      : theme.palette.text.primary,
    fontWeight: customcolor ? 600 : 400,
    padding: "0 12px",
    borderRadius: theme.shape.borderRadius * 2,
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    border: `1px solid ${customcolor ? 'transparent' : theme.palette.divider}`,
    '&:hover': {
      backgroundColor: customcolor 
        ? theme.palette.augmentColor({ color: { main: customcolor } }).dark
        : hoverBg,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[1],
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
    '& .MuiChip-label': {
      padding: '4px 0',
    }
  };
})

// Categories with label and optional dot color
const categories = [
  {label: "All", color: "#9E9E9E"}, // Gray for All
  {label: "Home", color: "#FFA726"}, // Orange
  {label: "Work", color: "#42A5F5"}, // Blue
  {label: "Personal", color: "#66BB6A"}, // Green
]

export default function SelectBar() {
  const [selected, setSelected] = React.useState("All")

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {categories.map(({label, color}) => (
        <StyledChip
          key={label}
          label={
            <Box display="flex" alignItems="center">
              <Dot color={color} />
              {label}
            </Box>
          }
          customcolor={selected === label ? color : null}
          onClick={() => setSelected(label)}
        />
      ))}
    </Box>
  )
}
