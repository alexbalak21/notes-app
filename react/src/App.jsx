import React, {useEffect, useState} from "react"
import axios from "axios"

export default function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")

  const fetchNotes = async () => {
    try {
      const response = await axios.get("/api/notes")
      setNotes(response.data)
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  const addNote = async (event) => {
    event.preventDefault()
    if (!newNote.trim()) return
    
    const noteObject = {
      title: newNote,
      important: false,
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
    }

    try {
      const response = await axios.post("/api/notes", noteObject)
      setNotes(notes.concat(response.data))
      setNewNote("")
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])
  return (
    <div>
      <h1>Notes</h1>
      <form onSubmit={addNote}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter note title"
        />
        <button type="submit">Save</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  )
}
