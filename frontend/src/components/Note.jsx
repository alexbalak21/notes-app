import { useState } from "react"
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
  IconButton as MuiIconButton,
  styled
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import CategoryChip from "./CategoryChip"

// Configurable character limit for note descriptions
const DESCRIPTION_CHAR_LIMIT = 450;

const Note = ({note, onUpdate, onDelete, categoryConfig = {}}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNote, setEditedNote] = useState({...note})
  const [isExpanded, setIsExpanded] = useState(false)

  const isLongDescription = note.description && note.description.length > DESCRIPTION_CHAR_LIMIT
  const displayDescription = isLongDescription && !isExpanded
      ? `${note.description.substring(0, DESCRIPTION_CHAR_LIMIT)}...`
      : note.description

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
            position: 'relative', // For absolute positioning of the category badge
          }}>

        <>
          {note.category && (
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <CategoryChip
                    category={note.category}
                    color={categoryConfig[note.category]?.color}
                    sx={{
                      pointerEvents: 'none', // Make it non-interactive in the note
                      backgroundColor: theme => theme.palette.mode === 'dark'
                          ? theme.palette.grey[800]
                          : theme.palette.grey[100],
                      '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark'
                            ? theme.palette.grey[700]
                            : theme.palette.grey[200],
                      },
                    }}
                />
              </Box>
          )}
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{wordBreak: "break-word", pr: note.category ? 6 : 0}}>
            {note.title || "Untitled"}
          </Typography>
          <Box sx={{ flexGrow: 1, mt: 1 }}>
            <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  mb: isLongDescription ? 1 : 0,
                }}>
              {displayDescription}
            </Typography>
            {isLongDescription && (
                <Typography
                    variant="caption"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                      display: 'inline-block',
                      fontWeight: 'medium',
                    }}
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </Typography>
            )}
          </Box>
        </>


        {/* Date and action buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="caption" color="text.secondary">
            {new Date(note.updated_at).toLocaleDateString("en-US", {
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
            onClose={() => {
              setIsEditing(false);
              // Reset expansion state when closing dialog
              setIsExpanded(false);
            }}
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
                  fullWidth
                  multiline
                  rows={8}
                  label="Description"
                  value={editedNote.description}
                  onChange={(e) => setEditedNote({...editedNote, description: e.target.value})}
                  margin="normal"
                  variant="outlined"
                  inputProps={{
                    maxLength: DESCRIPTION_CHAR_LIMIT,
                  }}
                  helperText={`${editedNote.description?.length || 0}/${DESCRIPTION_CHAR_LIMIT} characters`}
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mx: 0,
                      color: (editedNote.description?.length || 0) >= DESCRIPTION_CHAR_LIMIT ? 'error.main' : 'text.secondary',
                    }
                  }}
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