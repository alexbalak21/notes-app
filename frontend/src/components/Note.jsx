import {Box, IconButton, Paper, Typography} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const Note = ({note, onEdit, onDelete}) => {
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
      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{wordBreak: "break-word"}}>
        {note.title || "Untitled"}
      </Typography>

      {/* Description */}
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
