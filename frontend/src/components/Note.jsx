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
  IconButton as MuiIconButton
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CategoryChip from "./CategoryChip"
import EditNote from "./EditNote"

const Note = ({note, onUpdate, onDelete, categoryConfig = {}}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = (event) => {
    event.stopPropagation()
    setIsEditing(true)
  }

  const handleSave = (updatedNote) => {
    onUpdate?.(updatedNote)
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
                  wordBreak: "break-word"
                }}>
              {note.description}
            </Typography>
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
        <EditNote
          open={isEditing}
          onClose={() => setIsEditing(false)}
          note={note}
          onSave={handleSave}
          categories={Object.entries(categoryConfig).map(([name, config]) => ({
            id: name.toLowerCase(),
            name,
            color: config.color
          }))}
          categoryConfig={categoryConfig}
        />
      </Paper>
  )
}

export default Note