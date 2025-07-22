import * as React from "react"
import {styled, alpha} from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"

// Styled container for the search bar
const Search = styled("div")(({theme}) => ({
  position: "relative", // ensures the search icon can be absolutely positioned
  borderRadius: theme.shape.borderRadius, // applies theme's border radius
  backgroundColor: theme.palette.common.white, // sets background color
  boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`, // soft shadow for elevation
  display: "flex", // flex layout to center contents
  alignItems: "center", // vertical centering
  padding: theme.spacing(0.5, 1), // inner spacing
  marginLeft: theme.spacing(1), // default left margin for small screens
  marginRight: theme.spacing(1), // default right margin for small screens
  width: "calc(100% - 16px)", // avoids overflow by accounting for margin
  // Apply styles for screens size 'sm' and up
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3), // larger left margin for medium+ screens
    marginRight: theme.spacing(3), // larger right margin
    width: "100%", // override width to full container
  },
}))

// Wrapper for the Search icon
const SearchIconWrapper = styled("div")(({theme}) => ({
  padding: theme.spacing(0, 2), // horizontal padding
  height: "100%", // full height of container
  position: "absolute", // keeps icon in fixed spot inside input
  pointerEvents: "none", // allows clicks to go through to input
  display: "flex", // flex to center icon
  alignItems: "center",
  justifyContent: "center",
}))

// Styled input field
const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: theme.palette.grey[800], // text color
  width: "100%", // ensures input expands to fill space
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0), // input padding
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // account for icon width
    transition: theme.transitions.create("width"), // smooth resize animation
    width: "100%",
    fontSize: "0.95rem", // slightly smaller font
  },
}))

// Main functional component
export default function SearchBar() {
  return (
    <Search>
      {/* Icon on the left */}
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      {/* Input field */}
      <StyledInputBase
        placeholder="Search…"
        inputProps={{"aria-label": "search"}} // accessibility label
      />
    </Search>
  )
}
