import React, {useEffect, useState} from "react"
import axios from "axios"

export default function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState(1)
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories")
      setCategories(response.data)
      // Set default category to the first one if available
      if (response.data.length > 0 && !categoryId) {
        setCategoryId(response.data[0].id)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchNotes = async () => {
    try {
      const [notesResponse] = await Promise.all([
        axios.get("/api/notes"),
        fetchCategories() // Fetch categories in parallel with notes
      ])
      setNotes(notesResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  //TITLE & DESCRIPTION & CATEGORY_ID
  const addNote = async (event) => {
    event.preventDefault()
    if (!title.trim()) return
    
    const noteObject = {
      title: title,
      description: description,
      category_id: categoryId,
    }

    try {
      const response = await axios.post("/api/notes", noteObject)
      setNotes(notes.concat(response.data))
      setTitle("")
      setDescription("")
      setCategoryId(1)
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
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            required
          />
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter note description"
            rows="3"
          />
        </div>
        <div>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Save Note</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <small>Category: {categories.find(cat => cat.id === note.category_id)?.name || 'Uncategorized'}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
