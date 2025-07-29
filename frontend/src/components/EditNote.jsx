import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton as MuiIconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";
import { FaTimes as CloseIcon } from "react-icons/fa";
import Dot from "./Dot";


const EditNote = ({ 
  open, 
  onClose, 
  note, 
  onSave,
  categories = [],
  categoryConfig = {} 
}) => {
  const [editedNote, setEditedNote] = useState({...note});
  const [availableCategories, setAvailableCategories] = useState([]);

  // Filter out the 'All' category and set available categories
  useEffect(() => {
    if (categories && categories.length > 0) {
      const filtered = categories.filter(cat => cat.id !== 'all');
      setAvailableCategories(filtered);
      
      // Set default category if not set
      if (!editedNote.category && filtered.length > 0) {
        setEditedNote(prev => ({
          ...prev,
          category: filtered[0].name
        }));
      }
    }
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedNote);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Edit Note
          <MuiIconButton onClick={onClose} size="small">
            <CloseIcon />
          </MuiIconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editedNote.title || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="category"
              value={editedNote.category || ''}
              label="Category"
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Dot color={categoryConfig[selected]?.color || 'grey.500'} />  {selected}
                </Box>
              )}
            >
              {availableCategories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box 
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: categoryConfig[category.name]?.color || 'grey.500',
                        flexShrink: 0
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a category for this note</FormHelperText>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={8}
            name="description"
            label="Description"
            value={editedNote.description || ''}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!editedNote.title?.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditNote;
