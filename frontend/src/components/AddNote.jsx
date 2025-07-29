import {Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, FormControl, InputLabel, Select} from "@mui/material"
import { FaTimes as CloseIcon, FaPlus as AddIcon, FaTimes as ClearIcon } from "react-icons/fa"
import {useState, useEffect} from "react";
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const AddNote = ({open, onClose, onAddNote, onAddCategory, categories: propCategories = [], categoryConfig: propCategoryConfig = {}}) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#9e9e9e")
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Set default category when categories prop changes or dialog opens
  useEffect(() => {
    if (propCategories.length > 0) {
      // Filter out the 'All' category
      const validCategories = propCategories.filter(cat => cat.id !== 'all');
      
      // If no category is selected or the selected category doesn't exist in the list
      if (!category || !validCategories.some(cat => cat.name === category)) {
        // Select the first available category
        if (validCategories.length > 0) {
          setCategory(validCategories[0].name);
        }
      }
    }
  }, [propCategories, open]);

  // Reset form when dialog is closed/opened
  useEffect(() => {
    if (open) {
      // Reset form fields when opening
      setTitle("");
      setContent("");
      setNewCategory("");
      setNewCategoryColor("#9e9e9e");
      setShowNewCategory(false);
      
      // Set default category when opening
      if (propCategories.length > 0) {
        const firstCategory = propCategories.find(cat => cat.id !== 'all');
        if (firstCategory) {
          setCategory(firstCategory.name);
        }
      }
    }
  }, [open]);

  // Add new category
  const handleAddNewCategory = async () => {
    const trimmedName = newCategory.trim();
    if (!trimmedName) return;
    
    // Check if category already exists (case insensitive)
    const categoryExists = propCategories.some(
      cat => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (categoryExists) {
      // If category exists, just select it
      setCategory(trimmedName);
      setShowNewCategory(false);
      return;
    }
    
    try {
      const categoryData = {
        name: trimmedName,
        color: newCategoryColor
      };
      
      console.log('Adding new category:', categoryData);
      
      // Use the parent's handler to add the category
      const newCategoryData = await onAddCategory(categoryData);
      
      // Set the new category as selected
      setCategory(newCategoryData.name);
      setNewCategory("");
      setNewCategoryColor("#9e9e9e");
      setShowNewCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim() && content.trim() && !isLoading) {
      setIsLoading(true)
      try {
        // Find the category object to get its ID
        const selectedCategory = propCategories.find(cat => cat.name === category);
        
        const response = await axios.post(API_ENDPOINTS.NOTES, {
          title,
          description: content,
          category: selectedCategory ? selectedCategory.id : 1, // Default to 1 if category not found
        })
        onAddNote(response.data)
        onClose()
      } catch (error) {
        console.error("Error adding note:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
      <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          disableRestoreFocus
          slotProps={{
            backdrop: {
              onClick: (e) => {
                e.stopPropagation();
                onClose();
              }
            },
            transition: {
              onExited: () => {
                // Ensure focus is removed after the dialog has fully exited
                setTimeout(() => {
                  if (document.activeElement) {
                    document.activeElement.blur();
                  }
                }, 0);
              }
            }
          }}
      >
        <DialogTitle sx={{ py: 1, pr: 6, position: 'relative' }}>
          Add New Note
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mt: 0, mb: 2 }}
            />

            {/* Category Selection Row */}
            <Box display="flex" gap={2} alignItems="flex-start" mb={2} sx={{ minHeight: '56px' }}>
              {!showNewCategory && (
                <FormControl sx={{ flex: 1, minWidth: 120 }}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                      labelId="category-label"
                      value={category}
                      label="Category"
                      variant="outlined"
                      onChange={(e) => setCategory(e.target.value)}
                      fullWidth
                  >
                    {propCategories
                      .filter(cat => cat.id !== 0) // Exclude 'All' category
                      .map((cat) => (
                        <MenuItem key={cat.id} value={cat.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              backgroundColor: cat.color || '#9e9e9e' 
                            }} />
                            {cat.name}
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              {showNewCategory ? (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <Box display="flex" gap={1} alignItems="center" width="100%">
                      <TextField
                          size="small"
                          label="New Category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())}
                          fullWidth
                          sx={{ flex: 1 }}
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <input
                          type="color"
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          style={{
                            width: '40px',
                            height: '40px',
                            padding: '2px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddNewCategory}
                            disabled={!newCategory.trim()}
                            sx={{ minWidth: '80px' }}
                        >
                          Add
                        </Button>
                        <IconButton 
                          size="small" 
                          onClick={() => setShowNewCategory(false)}
                          sx={{ ml: 1 }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
              ) : (
                  <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setShowNewCategory(true)}
                      sx={{ 
                        whiteSpace: 'nowrap',
                        ml: 'auto',
                        alignSelf: 'center',
                        my: 'auto',
                        minWidth: '140px'
                      }}
                  >
                    New Category
                  </Button>
              )}
            </Box>

            <TextField
                margin="dense"
                label="Take a note..."
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    '& textarea': {
                      minHeight: '75px',
                    }
                  }
                }}
            />
          </DialogContent>
          <DialogActions sx={{px: 3, pb: 3}}>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={!title.trim() || !content.trim() || isLoading}>
              Add Note
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
}

export default AddNote