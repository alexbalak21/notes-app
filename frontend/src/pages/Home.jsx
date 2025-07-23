import {useState, useEffect} from "react"
import axios from "axios"
import {Box, Button, Container, Grid} from "@mui/material"
import AddNote from "../components/AddNote"
import Note from "../components/Note"
import SearchBar from "../components/SearchBar"
import SelectBar from "../components/SelectBar"
import AddIcon from "@mui/icons-material/Add";

// Import API configuration
import { API_ENDPOINTS } from '../config';

const Home = () => {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  // Default to an array with 'All' as the first category
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }])
  const [categoryConfig, setCategoryConfig] = useState({})

  /**
   * Fetches all notes from the API when the component mounts.
   * - Makes a GET request to the /api/notes endpoint
   * - Updates both the main notes state and filteredNotes state
   * - Any errors are caught and logged to the console
   */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.NOTES)
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
   * Fetches all unique categories from the API when the component mounts
   * and updates the categories state with 'All'  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.CATEGORIES)
        // Add 'All' as the first category
        const allCategories = [
          { id: 'all', name: 'All' },
          ...response.data
        ]
        
        // Create a mapping of category names to their colors
        const config = {};
        response.data.forEach(cat => {
          config[cat.name] = { color: cat.color };
        });
        
        setCategories(allCategories)
        setCategoryConfig(config)
        console.log("Fetched categories:", allCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        // If the endpoint fails, fall back to default categories
        const defaultCategories = [
          { id: 'all', name: 'All' },
          { id: 1, name: 'Home', color: '#2196f3' },
          { id: 2, name: 'Work', color: '#4caf50' },
          { id: 3, name: 'Personal', color: '#9c27b0' }
        ]
        setCategories(defaultCategories)
        
        const defaultConfig = {
          'Home': { color: '#2196f3' },
          'Work': { color: '#4caf50' },
          'Personal': { color: '#9c27b0' }
        };
        setCategoryConfig(defaultConfig)
      }
    }
    
    fetchCategories()
  }, [])

  
  /**
   * Filters notes based on search query and selected category.
   * Implements real-time filtering across note titles, descriptions, tags, and categories.
   */
  useEffect(() => {
    let results = [...notes];
    
    // Filter by category if not 'All'
    if (selectedCategory !== 'All') {
      results = results.filter(note => 
        note.category && note.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTerm = searchQuery.toLowerCase().trim();
      
      results = results.filter(note => {
        if (!note) return false;
        
        // Check title
        const hasTitleMatch = note.title && 
                            typeof note.title === 'string' && 
                            note.title.toLowerCase().includes(searchTerm);
        if (hasTitleMatch) return true;
        
        // Check description
        const hasDescriptionMatch = note.description && 
                                  typeof note.description === 'string' && 
                                  note.description.toLowerCase().includes(searchTerm);
        if (hasDescriptionMatch) return true;
        
        // Check tags if they exist
        if (Array.isArray(note.tags)) {
          const hasTagMatch = note.tags.some(tag => 
            tag && typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)
          );
          if (hasTagMatch) return true;
        }
        
        return false;
      });
    }
    
    setFilteredNotes(results);
  }, [searchQuery, notes, selectedCategory])

  const handleAddNote = (newNote) => {
    axios
      .post(API_ENDPOINTS.NOTES, newNote)
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
  
  // Add a new category
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.CATEGORIES, categoryData);
      const newCategory = response.data;
      
      // Update categories list
      setCategories(prevCategories => [
        ...prevCategories.filter(cat => cat.id !== 'all'),
        newCategory,
        { id: 'all', name: 'All' }
      ]);
      
      // Update category config
      setCategoryConfig(prevConfig => ({
        ...prevConfig,
        [newCategory.name]: { color: newCategory.color }
      }));
      
      return newCategory;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }

  const handleUpdateNote = (updatedNote) => {
    axios
      .put(`${API_ENDPOINTS.NOTES}/${updatedNote.id}`, updatedNote)
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
      .delete(`${API_ENDPOINTS.NOTES}/${noteId}`)
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
          onSearchChange={setSearchQuery}
        />
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginX: 3}}>
          <SelectBar 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
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
                : selectedCategory !== 'All'
                  ? `No notes found in the "${selectedCategory}" category`
                  : 'No notes available. Create your first note to get started!'}
            </Box>
          )}
        </Grid>
      </Container>
      <AddNote 
        onAddNote={handleAddNote} 
        onAddCategory={handleAddCategory}
        categories={categories}
        categoryConfig={categoryConfig}
        open={isAddNoteOpen} 
        onClose={handleCloseAddNote} 
      />
    </Box>
  )
}

export default Home
