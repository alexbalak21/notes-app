import React, { useEffect, useState } from "react"
import axios from "axios"


export default function App() {
  const [notes, setNotes] = useState([])

  const fetchNotes = async () => {
    try {
      const response = await axios.get("/api/notes")
      setNotes(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])
  return <div>
    <h1>Notes</h1>
    <ul>
      {notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>    
  </div>
}
