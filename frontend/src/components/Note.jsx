import {useState} from "react"
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton as MuiIconButton
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"

const Note = ({note, onUpdate, onDelete}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNote, setEditedNote] = useState({...note})

  const handleEdit = (event) => {
    event.stopPropagation()
    setEditedNote({...note})
    setIsEditing(true)
  }

  const handleSave = (event) => {
    event.preventDefault()
    onUpdate?.(editedNote)
    setIsEditing(false)
  }

  const handleDeleteClick = (event) => {
    event.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = (event) => {
    event.stopPropagation()
    setDeleteDialogOpen(false)
    onDelete?.(note.id)
  }

  const handleDeleteCancel = (event) => {
    event.stopPropagation()
    setDeleteDialogOpen(false)
  }
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        minHeight: "240px",
        width: "100%", // Fill parent Grid item
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>

        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{wordBreak: "break-word"}}>
            {note.title || "Untitled"}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              flexGrow: 1,
              whiteSpace: "pre-line",
              mt: 1,
              wordBreak: "break-word",
            }}>
            {note.description}
          </Typography>
        </>
      

      {/* Date and action buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="caption" color="text.secondary">
          {new Date(note.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={handleEdit}
            sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDeleteClick}
            sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Note?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            No, Keep It
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', boxShadow: 'none' }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog 
        open={isEditing} 
        onClose={() => setIsEditing(false)}
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Edit Note
            <MuiIconButton onClick={() => setIsEditing(false)} size="small">
              <CloseIcon />
            </MuiIconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editedNote.title || ''}
              onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={editedNote.description || ''}
              onChange={(e) => setEditedNote({...editedNote, description: e.target.value})}
            />
          </DialogContent>
          <DialogActions sx={{px: 3, pb: 3}}>
            <Button 
              onClick={() => setIsEditing(false)} 
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
    </Paper>
  )
}

export default Note
