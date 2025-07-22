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

// Styled Chip that takes backgroundColor dynamically
const StyledChip = styled(Chip)(({theme, customcolor}) => ({
  margin: theme.spacing(0.5),
  backgroundColor: customcolor || theme.palette.grey[100], // selected color or default
  color: customcolor ? theme.palette.common.white : theme.palette.text.primary,
  fontWeight: customcolor ? 600 : 400,
  padding: "0 12px",
  borderRadius: theme.shape.borderRadius * 2,
  cursor: "pointer",
  transition: "all 0.3s ease", // smooth transition
}))

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
