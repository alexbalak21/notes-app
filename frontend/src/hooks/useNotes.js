import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Process note data to ensure consistent format
  const processNote = useCallback((note) => {
    // Ensure category_id is a number and not 0 (0 is reserved for 'All' in the UI)
    const categoryId = note.category_id && note.category_id !== 0 ? note.category_id : 1;
    
    return {
      ...note,
      category_id: categoryId,
      updated_on: note.updated_on || new Date().toISOString()
    };
  }, []);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.NOTES);
      const processedNotes = Array.isArray(response.data) 
        ? response.data.map(processNote)
        : [];
      
      setNotes(processedNotes);
      setError(null);
      
      return processedNotes;
    } catch (err) {
      console.error('Error fetching notes:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [processNote]);

  // Add a new note
  const addNote = useCallback(async (newNote) => {
    try {
      if (!newNote.title || !newNote.description) {
        throw new Error('Title and description are required');
      }

      // Ensure we don't try to save with category_id 0 (reserved for 'All' in the UI)
      const categoryId = newNote.category_id && newNote.category_id !== 0 ? newNote.category_id : 1;

      const noteToAdd = {
        ...newNote,
        category_id: categoryId
      };

      const response = await axios.post(API_ENDPOINTS.NOTES, noteToAdd);
      const processedNote = processNote(response.data);
      
      // Update the local state with the new note
      setNotes(prevNotes => [...prevNotes, processedNote]);
      setError(null);
      return processedNote;
    } catch (err) {
      console.error('Error adding note:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err; // Re-throw to be caught by the form
    }
  }, [processNote]); // Add processNote to the dependency array

  // Update an existing note
  const updateNote = async (updatedNote) => {
    try {
      if (!updatedNote.id) {
        throw new Error('Note ID is required for update');
      }

      const response = await axios.put(
        `${API_ENDPOINTS.NOTES}/${updatedNote.id}`, 
        updatedNote
      );
      
      const processedNote = processNote(response.data);
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === updatedNote.id ? processedNote : note
        )
      );
      
      setError(null);
      return processedNote;
    } catch (err) {
      console.error('Error updating note:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      if (!noteId) {
        throw new Error('Note ID is required for deletion');
      }
      
      await axios.delete(`${API_ENDPOINTS.NOTES}/${noteId}`);
      
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Get notes by category
  const getNotesByCategory = useCallback((categoryId) => {
    if (!categoryId || categoryId === 'all') {
      return [...notes];
    }
    return notes.filter(note => 
      note.category_id === categoryId || 
      note.category_id?.toString() === categoryId.toString()
    );
  }, [notes]);

  // Get a single note by ID
  const getNoteById = useCallback((noteId) => {
    if (!noteId) return null;
    return notes.find(note => 
      note.id === noteId || 
      note.id?.toString() === noteId.toString()
    );
  }, [notes]);

  // Initial fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getNotesByCategory,
    getNoteById,
    refreshNotes: fetchNotes
  };
};