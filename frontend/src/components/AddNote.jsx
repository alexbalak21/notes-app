import {Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, FormControl, InputLabel, Select, InputAdornment} from "@mui/material"
import {Close as CloseIcon, Add as AddIcon} from "@mui/icons-material"
import {useState, useEffect} from "react"

// Default categories
const defaultCategories = ["Home", "Work", "Personal"];

const AddNote = ({open, onClose, onAddNote}) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Home")
  const [categories, setCategories] = useState(defaultCategories)
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setTitle("")
      setContent("")
      setCategory("Home")
      setNewCategory("")
      setShowNewCategory(false)
    }
  }, [open])

  // Add new category
  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      setCategory(newCategory)
      setNewCategory("")
      setShowNewCategory(false)
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
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add New Note
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
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
                sx={{mb: 2}}
            />

            {/* Category Selection Row */}
            <Box display="flex" gap={2} alignItems="flex-end" mb={2}>
              <FormControl sx={{ width: '50%' }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                >
                  {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {showNewCategory ? (
                  <Box display="flex" gap={1} flex={1}>
                    <TextField
                        size="small"
                        label="New Category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddNewCategory}
                        disabled={!newCategory.trim()}
                    >
                      Add
                    </Button>
                  </Box>
              ) : (
                  <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setShowNewCategory(true)}
                      sx={{ whiteSpace: 'nowrap' }}
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
            <Button type="submit" variant="contained" color="primary" disabled={!title.trim() || !content.trim()}>
              Add Note
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
}

export default AddNote