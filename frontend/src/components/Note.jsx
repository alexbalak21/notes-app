import {Box, IconButton, Paper, Typography, Checkbox} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const Note = ({note, onEdit, onDelete}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 2,
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
      {/* Checkbox top-left */}

      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {note.title || "Untitled"}
      </Typography>

      {/* Description */}
      <Typography variant="body2" color="text.primary" sx={{flexGrow: 1, whiteSpace: "pre-line", mt: 1}}>
        {note.description}
      </Typography>

      {/* Date and icons row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="caption" color="text.secondary">
          {new Date(note.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
        <Box>
          <IconButton size="small" onClick={() => onEdit?.(note)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete?.(note.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default Note
