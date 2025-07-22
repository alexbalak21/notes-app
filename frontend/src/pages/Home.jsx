import {useState, useEffect} from "react"
import axios from "axios"
import {Box, Container, Grid, Paper, Typography} from "@mui/material"
import TopBar from "../components/TopBar"
import AddNote from "../components/AddNote"
import Note from "../components/Note"
import SearchBar from "../components/SearchBar"

const Home = () => {
  const [notes, setNotes] = useState([])
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/notes")
      .then((response) => {
        setNotes(response.data)
        console.log("Fetched notes:", response.data)
      })
      .catch((error) => {
        console.error("Error fetching notes:", error)
      })
  }, [])

  const handleAddNote = (newNote) => {
    setNotes([...notes, {...newNote, id: Date.now()}])
    setIsAddNoteOpen(false) // close dialog after adding
  }

  const handleOpenAddNote = () => setIsAddNoteOpen(true)
  const handleCloseAddNote = () => setIsAddNoteOpen(false)

  return (
    <Box sx={{bgcolor: "bg", minHeight: "100vh"}}>
      <Container maxWidth="lg" sx={{pt: 2}}>
        <SearchBar />
        <Grid container spacing={3} sx={{mt: 2}}>
          {notes.map((note) => (
            <Grid item key={note.id} xs={12} sm={6} md={4}>
              <Note note={note} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <AddNote onAddNote={handleAddNote} open={isAddNoteOpen} onClose={handleCloseAddNote} />
    </Box>
  )
}

export default Home
