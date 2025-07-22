import { Routes, Route } from "react-router";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useMemo } from 'react';
import Home from "./pages/Home";
import Page from "./pages/Page";
import Login from "./pages/Login";
import ThemeToggleButton from "./components/ThemeToggle/ThemeToggleButton";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light theme colors
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#9c27b0',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
        }
      : {
          // Dark theme colors
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#ce93d8',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        }),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#1976d2',
        },
      },
    },
  },
});

const AppContent = () => {
  const { darkMode } = useTheme();
  const theme = useMemo(() => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')), [darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeToggleButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page" element={<Page />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MuiThemeProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
