import {Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, FormControl, InputLabel, Select, InputAdornment} from "@mui/material"
import {Close as CloseIcon, Add as AddIcon, Clear as ClearIcon} from "@mui/icons-material"
import {useState, useEffect, useRef} from "react";
import axios from 'axios';

const AddNote = ({open, onClose, onAddNote}) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [categoryConfig, setCategoryConfig] = useState({})
  const [newCategory, setNewCategory] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#9e9e9e")
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/categories");
      const categoriesData = response.data;
      
      // Create a mapping of category names to their colors
      const config = {};
      categoriesData.forEach(cat => {
        config[cat.name] = { color: cat.color };
      });
      
      setCategoryConfig(config);
      setCategories(categoriesData.map(cat => cat.name));
      
      // Set default category to the first one if not set
      if (categoriesData.length > 0 && !category) {
        setCategory(categoriesData[0].name);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories when component mounts and when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setTitle("")
      setContent("")
      setNewCategory("")
      setNewCategoryColor("#9e9e9e")
      setShowNewCategory(false)
    } else {
      // Reset to first category when opening
      if (categories.length > 0) {
        setCategory(categories[0]);
      }
    }
  }, [open, categories])

  // Add new category
  const handleAddNewCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      try {
        const categoryData = {
          name: newCategory,
          color: newCategoryColor
        };
        
        console.log('Posting new category:', categoryData);
        
        // Post the new category to the backend
        await axios.post("http://127.0.0.1:5000/api/categories", categoryData);
        
        // Refresh categories from backend
        await fetchCategories();
        
        // Set the new category as selected
        setCategory(newCategory);
        setNewCategory("");
        setNewCategoryColor("#9e9e9e");
        setShowNewCategory(false);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/notes", {
          title,
          description: content,
          category: category,
        })
        onAddNote(response.data)
        onClose()
      } catch (error) {
        console.error("Error adding note:", error)
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
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <span>{cat}</span>
                            <Box 
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: categoryConfig[cat]?.color || '#757575',
                                ml: 1,
                                flexShrink: 0
                              }}
                            />
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