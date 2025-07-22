import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton 
        onClick={toggleTheme} 
        color="inherit"
        aria-label="toggle theme"
        sx={{ 
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1200,
          backgroundColor: theme => theme.palette.background.paper,
          '&:hover': {
            backgroundColor: theme => theme.palette.action.hover,
          },
          boxShadow: 1,
          width: 40,
          height: 40,
          [theme => theme.breakpoints.down('sm')]: {
            width: 36,
            height: 36,
            top: 12,
            right: 12,
          },
        }}
      >
        {darkMode ? 
          <Brightness7Icon fontSize="small" /> : 
          <Brightness4Icon fontSize="small" />
        }
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
