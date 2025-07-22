import {Routes, Route} from "react-router"
import {CssBaseline} from "@mui/material"
import {ThemeProvider, createTheme} from "@mui/material/styles"
import Home from "./pages/Home"
import Page from "./pages/Page"
import Login from "./pages/Login"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    bg: "",
    fg: "#696969",
  },
})

const lightTheme = createTheme({
  palette: {
    mode: "light",
    bg: "#f5f5f5",
    foreground: {
      main: "#900000",
    },
  },
})

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/page" element={<Page />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </ThemeProvider>
)

export default App
