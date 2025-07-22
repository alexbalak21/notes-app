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
  const [filteredNotes, setFilteredNotes] = useState([])
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/notes")
        setNotes(response.data)
        setFilteredNotes(response.data)
        console.log("Fetched notes:", response.data)
      } catch (error) {
        console.error("Error fetching notes:", error)
      }
    }
    
    fetchNotes()
  }, [])
  
  // Filter notes when search query changes or when notes are updated
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setFilteredNotes(notes);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase().trim();
    const filtered = notes.filter(note => {
      // Make sure note and its properties exist before trying to access them
      if (!note) return false;
      
      // Check title
      if (note.title && typeof note.title === 'string' && note.title.toLowerCase().includes(lowercasedQuery)) {
        return true;
      }
      
      // Check content
      if (note.content && typeof note.content === 'string' && note.content.toLowerCase().includes(lowercasedQuery)) {
        return true;
      }
      
      // Check tags if they exist
      if (Array.isArray(note.tags)) {
        return note.tags.some(tag => 
          tag && typeof tag === 'string' && tag.toLowerCase().includes(lowercasedQuery)
        );
      }
      
      return false;
    });
    
    setFilteredNotes(filtered);
  }, [searchQuery, notes])

  const handleAddNote = (newNote) => {
    axios
      .post("http://127.0.0.1:5000/api/notes", newNote)
      .then((response) => {
        const updatedNotes = [...notes, response.data]
        setNotes(updatedNotes)
        // Update filtered notes if needed
        if (!searchQuery.trim()) {
          setFilteredNotes(updatedNotes)
        }
        setIsAddNoteOpen(false)
      })
      .catch((error) => {
        console.error("Error adding note:", error)
      })
  }

  const handleUpdateNote = (updatedNote) => {
    axios
      .put(`http://127.0.0.1:5000/api/notes/${updatedNote.id}`, updatedNote)
      .then((response) => {
        const updatedNotes = notes.map(note => 
          note.id === updatedNote.id ? response.data : note
        )
        setNotes(updatedNotes)
        // Update filtered notes if needed
        if (!searchQuery.trim()) {
          setFilteredNotes(updatedNotes)
        }
      })
      .catch((error) => {
        console.error("Error updating note:", error)
      })
  }

  const handleDeleteNote = (noteId) => {
    axios
      .delete(`http://127.0.0.1:5000/api/notes/${noteId}`)
      .then(() => {
        const updatedNotes = notes.filter(note => note.id !== noteId)
        setNotes(updatedNotes)
        // Update filtered notes if needed
        if (!searchQuery.trim()) {
          setFilteredNotes(updatedNotes)
        }
      })
      .catch((error) => {
        console.error("Error deleting note:", error)
      })
  }

  const handleOpenAddNote = () => setIsAddNoteOpen(true)
  const handleCloseAddNote = () => setIsAddNoteOpen(false)

  return (
    <Box sx={{bgcolor: "bg", minHeight: "100vh"}}>
      <Container maxWidth="lg" sx={{pt: 2}}>
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginX: 3}}>
          <SelectBar />
          <Button sx={{ ml: 3 }} size="large" variant="contained" onClick={handleOpenAddNote}>
            <AddIcon /> Add
          </Button>
        </Box>
        <Grid container spacing={2} sx={{mt: 2, width: '100%', display: 'flex', flexWrap: 'wrap'}}>
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => note && (
            <Grid item key={note.id} xs={12} sm={6} lg={4} sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0, // Prevent overflow
              width: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(33.333% - 16px)' },
              flex: '0 0 auto',
              boxSizing: 'border-box'
            }}>
              <Note 
                note={note} 
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />
            </Grid>
          ))) : (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4, color: 'text.secondary' }}>
              {searchQuery && searchQuery.trim() !== '' ? 'No notes match your search.' : 'No notes found.'}
            </Box>
          )}
        </Grid>
      </Container>
      <AddNote onAddNote={handleAddNote} open={isAddNoteOpen} onClose={handleCloseAddNote} />
    </Box>
  )
}

export default Home
