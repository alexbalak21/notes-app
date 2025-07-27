import { useState, useCallback } from 'react';
import { Box, Button, Container, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import AddNote from '../components/AddNote';
import Note from '../components/Note';
import SearchBar from '../components/SearchBar';
import SelectBar from '../components/SelectBar';

// Custom hooks
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import { useNoteFilters } from '../hooks/useNoteFilters';

const Home = () => {
  // State for UI
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Data management with custom hooks
  const { 
    notes, 
    isLoading: isLoadingNotes, 
    error: notesError, 
    addNote, 
    updateNote, 
    deleteNote 
  } = useNotes();

  const { 
    categories, 
    isLoading: isLoadingCategories, 
    error: categoriesError, 
    addCategory 
  } = useCategories();

  // Filter notes based on search and category
  const filteredNotes = useNoteFilters(notes, { searchQuery, selectedCategory });
  
  // Helper function to get category by ID
  const getCategoryById = useCallback((categoryId) => {
    if (categoryId === 0) return { id: 0, name: 'All' };
    return categories.find(cat => cat.id === categoryId || cat.id === parseInt(categoryId));
  }, [categories]);

  // Handle note operations
  const handleAddNote = async (newNote) => {
    try {
      await addNote(newNote);
      setIsAddNoteOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    try {
      await updateNote(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Handle category operations
  const handleAddCategory = async (categoryData) => {
    try {
      await addCategory(categoryData);
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  // UI handlers
  const handleOpenAddNote = () => setIsAddNoteOpen(true);
  const handleCloseAddNote = () => setIsAddNoteOpen(false);
  // Handle search and category changes
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (isLoadingNotes || isLoadingCategories) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <p>Loading...</p>
        </Box>
      </Container>
    );
  }

  // Show error state if any
  if (notesError || categoriesError) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, color: 'error.main' }}>
          <p>Error loading data. Please try again later.</p>
          {notesError && <p>Notes error: {notesError}</p>}
          {categoriesError && <p>Categories error: {categoriesError}</p>}
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />
        
        <Box sx={{ 
          mt: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginX: 3 
        }}>
          <SelectBar 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />
          <Button 
            sx={{ ml: 3 }} 
            size="large" 
            variant="contained" 
            onClick={handleOpenAddNote}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>

        <Grid 
          container 
          spacing={2} 
          sx={{ 
            mt: 2, 
            width: '100%', 
            display: 'flex', 
            flexWrap: 'wrap' 
          }}
        >
          {filteredNotes.length === 0 ? (
            <Box sx={{ 
              width: '100%', 
              textAlign: 'center', 
              mt: 4, 
              color: 'text.secondary' 
            }}>
              {searchQuery && searchQuery.trim() !== '' 
                ? `No notes found matching "${searchQuery}"`
                : selectedCategory !== 'All'
                  ? `No notes found in the "${selectedCategory}" category`
                  : 'No notes available. Create your first note to get started!'}
            </Box>
          ) : (
            filteredNotes.map((note) => (
              <Grid 
                item 
                key={note.id} 
                xs={12} 
                sm={6} 
                lg={4} 
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  width: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(33.333% - 16px)' },
                  flex: '0 0 auto',
                  boxSizing: 'border-box'
                }}
              >
                <Note 
                  key={note.id}
                  note={note} 
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                  categoryName={getCategoryById(note.category_id)?.name}
                  categoryColor={getCategoryById(note.category_id)?.color}
                />
              </Grid>
            ))
          )}
        </Grid>

        <AddNote 
          open={isAddNoteOpen} 
          onClose={handleCloseAddNote}
          onAddNote={handleAddNote}
          categories={categories.filter(cat => cat.id !== 'all')}
          onAddCategory={handleAddCategory}
        />
      </Container>
    </Box>
  )
}

export default Home;
