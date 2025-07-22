import * as React from "react"
import {styled, alpha} from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"

const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black, 0.13),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "80%", // Ensuring the Search component is 80% wide
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "80%", // Ensuring the width is maintained for larger screens
  },
}))

const SearchIconWrapper = styled("div")(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: "inherit",
  width: "100%", // Ensure it spans the entire available width
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%", // Ensure input occupies 100% of its container
  },
}))

export default function SearchBar() {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase placeholder="Search…" inputProps={{"aria-label": "search"}} />
    </Search>
  )
}
