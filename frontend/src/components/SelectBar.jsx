import * as React from "react"
import { Box } from "@mui/material"
import CategoryChip from "./CategoryChip"

// Categories with label and color
const categories = ["All", "Home", "Work", "Personal"]

export default function SelectBar() {
  const [selected, setSelected] = React.useState("All")

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {categories.map((category) => (
        <Box key={category} mx={0.5} my={0.5}>
          <CategoryChip
            category={category}
            selected={selected === category}
            onClick={() => setSelected(category)}
          />
        </Box>
      ))}
    </Box>
  )
}
