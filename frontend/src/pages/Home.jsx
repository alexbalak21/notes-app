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

  /**
   * Fetches all notes from the API when the component mounts.
   * - Makes a GET request to the /api/notes endpoint
   * - Updates both the main notes state and filteredNotes state
   * - Any errors are caught and logged to the console
   */
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
  
  /**
   * Filters notes whenever the search query or notes change.
   * Implements real-time search across note titles, descriptions, and tags.
   * 
   * Search Behavior:
   * 1. If search is empty, shows all notes
   * 2. Otherwise, filters notes where the search term appears in:
   *    - Title (case-insensitive)
   *    - Description (case-insensitive)
   *    - Any tag (if tags exist, case-insensitive)
   */
  useEffect(() => {
    // If search query is empty or only contains whitespace, show all notes
    if (!searchQuery || searchQuery.trim() === '') {
      setFilteredNotes(notes);
      return;
    }

    // Convert search query to lowercase once for case-insensitive comparison
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Filter through all notes to find matches
    const filteredResults = notes.filter(note => {
      // Safety check: skip if note is null/undefined
      if (!note) return false;
      
      // 1. Check if search term exists in note's title
      const hasTitleMatch = note.title && 
                          typeof note.title === 'string' && 
                          note.title.toLowerCase().includes(searchTerm);
      if (hasTitleMatch) return true;
      
      // 2. Check if search term exists in note's description
      const hasDescriptionMatch = note.description && 
                                typeof note.description === 'string' && 
                                note.description.toLowerCase().includes(searchTerm);
      if (hasDescriptionMatch) return true;
      
      // 3. Check if search term matches any of the note's tags
      if (Array.isArray(note.tags)) {
        const hasTagMatch = note.tags.some(tag => 
          tag && typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)
        );
        if (hasTagMatch) return true;
      }
      
      // If we get here, the note doesn't match the search criteria
      return false;
    });
    
    // Update the filtered notes that will be displayed
    setFilteredNotes(filteredResults);
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
        {/* 
          SearchBar Component
          - Controlled component that manages the search input
          - searchQuery: Current search term (controlled by parent)
          - onSearchChange: Callback to update search term in parent's state
          - The search happens in real-time as the user types
        */}
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}x
        />
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginX: 3}}>
          <SelectBar />
          <Button sx={{ ml: 3 }} size="large" variant="contained" onClick={handleOpenAddNote}>
            <AddIcon /> Add
          </Button>
        </Box>
        {/**
         * Responsive Grid Layout for Notes:
         * - On extra small screens: 1 column (full width)
         * - On small screens: 2 columns (50% width each)
         * - On large screens: 3 columns (33.33% width each)
         */}
        <Grid container spacing={2} sx={{mt: 2, width: '100%', display: 'flex', flexWrap: 'wrap'}}>
          {/* 
            Conditional Rendering:
            - If there are filtered notes, map through and display them
            - If no notes match the search, show a helpful message
          */}
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
              {searchQuery && searchQuery.trim() !== '' 
                ? `No notes found matching "${searchQuery}"` 
                : 'No notes available. Create your first note to get started!'}
            </Box>
          )}
        </Grid>
      </Container>
      <AddNote onAddNote={handleAddNote} open={isAddNoteOpen} onClose={handleCloseAddNote} />
    </Box>
  )
}

export default Home
