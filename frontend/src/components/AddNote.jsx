import PropTypes from "prop-types"
import axios from "axios"
import {Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, FormControl, InputLabel, Select} from "@mui/material"
import {Close as CloseIcon} from "@mui/icons-material"
import {useState, useEffect} from "react"

// Available categories
const categories = ["Home", "Work", "Personal"];

const AddNote = ({open, onClose, onAddNote}) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Home")

  useEffect(() => {
    if (!open) {
      setTitle("")
      setContent("")
      setCategory("Home")
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/notes", {
          title,
          description: content,
          category: category,
        })
        onAddNote(response.data) // send full note back to Home
        setTitle("")
        setContent("")
        setCategory("Home")
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
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '600px',
          margin: 0,
          '& .MuiDialogContent-root': {
            flex: '1 1 auto',
            minHeight: 0,
          }
        }
      }}
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ mb: 2 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

AddNote.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
}

export default AddNote
