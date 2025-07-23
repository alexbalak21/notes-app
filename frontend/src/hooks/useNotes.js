import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.NOTES);
      setNotes(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new note
  const addNote = async (newNote) => {
    try {
      const response = await axios.post(API_ENDPOINTS.NOTES, newNote);
      setNotes(prevNotes => [...prevNotes, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding note:', err);
      throw err;
    }
  };

  // Update an existing note
  const updateNote = async (updatedNote) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.NOTES}/${updatedNote.id}`, 
        updatedNote
      );
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === updatedNote.id ? response.data : note)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.NOTES}/${noteId}`);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
};
