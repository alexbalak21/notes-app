import {Paper, Typography} from "@mui/material"

const Note = ({note}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "200px",
      }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {note.title || "Untitled"}
      </Typography>
      <Typography variant="body1" sx={{flexGrow: 1, whiteSpace: "pre-line"}}>
        {note.description}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{mt: 1}}>
        Created: {new Date(note.created_at).toLocaleDateString()}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{mt: 0.5}}>
        Updated: {new Date(note.updated_at).toLocaleDateString()}
      </Typography>
    </Paper>
  )
}

export default Note
