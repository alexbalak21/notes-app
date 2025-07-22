import * as React from "react"
import {styled, alpha} from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from "@mui/material/IconButton"

// Styled container for the search bar
const Search = styled("div")(({theme}) => ({
  position: "relative", // ensures the search icon can be absolutely positioned
  borderRadius: theme.shape.borderRadius, // applies theme's border radius
  backgroundColor: theme.palette.common.white, // sets background color
  boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`, // soft shadow for elevation
  '&:hover': {
    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.15)}`, // subtle hover effect
  },
  padding: theme.spacing(0.5, 1), // inner spacing
  margin: theme.spacing(0, 2), // equal margins on both sides
  width: "calc(100% - 32px)", // adjust width to account for margins
  display: 'flex', // Use flex for the container
  alignItems: 'center', // Center items vertically
  // Apply styles for screens size 'sm' and up
  [theme.breakpoints.up("sm")]: {
    margin: theme.spacing(0, 3), // equal margins on both sides for larger screens
    width: "calc(100% - 48px)", // adjust width to account for margins
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
  flex: 1, // takes remaining space
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0), // input padding
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // account for icon width
    transition: theme.transitions.create("width"), // smooth resize animation
    width: "100%",
    fontSize: "0.95rem", // slightly smaller font
  },
}))

const SearchButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})(({ theme, hasValue }) => ({
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  transition: theme.transitions.create(['opacity', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  opacity: hasValue ? 1 : 0,
  transform: hasValue ? 'scale(1)' : 'scale(0.9)',
  pointerEvents: hasValue ? 'auto' : 'none',
}))

// Main functional component
export default function SearchBar({ searchQuery, onSearchChange }) {
  const handleInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <Search>
      {/* Icon on the left */}
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      {/* Input field */}
      <StyledInputBase
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search by title, content, or tags…"
        inputProps={{"aria-label": "search"}} // accessibility label
      />
      
      <SearchButton 
        aria-label="search"
        type="submit"
        hasValue={!!searchQuery}
      >
        <ArrowForwardIcon />
      </SearchButton>
    </Search>
  )
}
