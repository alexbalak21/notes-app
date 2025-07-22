import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import SearchBar from "./SearchBar"
import {Button, Container} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import PropTypes from 'prop-types';

export default function TopBar({ onAddClick }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="default" position="static">
        <Container>
          <Toolbar>
            <SearchBar />
            <Button 
              sx={{ 
                ml: 3, 
                whiteSpace: 'nowrap'
              }} 
              size="large" 
              variant="contained" 
              onClick={onAddClick}
            >
              <AddIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} /> 
              <Box component="span" sx={{ ml: { xs: 0, sm: 0.5 } }}>Add</Box>
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

TopBar.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};
