import {useState, useEffect} from "react"
import axios from "axios"
import {Box, Button, Container, Grid} from "@mui/material"
import AddNote from "../components/AddNote"
import Note from "../components/Note"
import SearchBar from "../components/SearchBar"
import SelectBar from "../components/SelectBar"
import AddIcon from "@mui/icons-material/Add";

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
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginX: 3}}>
          <SelectBar />
          <Button sx={{ ml: 3 }} size="large" variant="contained" onClick={handleOpenAddNote}>
            <AddIcon /> Add
          </Button>
        </Box>
        <Grid container spacing={2} sx={{mt: 2, width: '100%', display: 'flex', flexWrap: 'wrap'}}>
          {notes.map((note) => (
            <Grid item key={note.id} xs={12} sm={6} lg={4} sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0, // Prevent overflow
              width: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(33.333% - 16px)' },
              flex: '0 0 auto',
              boxSizing: 'border-box'
            }}>
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
