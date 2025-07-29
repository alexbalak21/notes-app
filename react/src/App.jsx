import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBook, FaListUl, FaPlus, FaStickyNote } from 'react-icons/fa';
import CategoryManager from './components/CategoryManager';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'categories'

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      // Set default category to the first one if available
      if (response.data.length > 0 && !categoryId) {
        setCategoryId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const [notesResponse] = await Promise.all([
        axios.get('/api/notes'),
        fetchCategories() // Fetch categories in parallel with notes
      ]);
      setNotes(notesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addNote = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    
    const noteObject = {
      title: title,
      description: description,
      category_id: categoryId,
    };

    try {
      const response = await axios.post('/api/notes', noteObject);
      setNotes(notes.concat(response.data));
      setTitle('');
      setDescription('');
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  useEffect(() => {
    fetchNotes()
  }, [])
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{
        width: isSidebarCollapsed ? '80px' : '250px',
        backgroundColor: '#001529',
        color: 'white',
        transition: 'width 0.3s',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {!isSidebarCollapsed && <h2 style={{ margin: 0, color: 'white' }}>Notes App</h2>}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
            }}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <FaListUl /> : <FaListUl />}
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: activeTab === 'notes' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textAlign: 'left',
                  transition: 'background-color 0.2s'
                }}
              >
                <FaStickyNote style={{ marginRight: isSidebarCollapsed ? 0 : '0.75rem', fontSize: '1.25rem' }} />
                {!isSidebarCollapsed && <span>Notes</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: activeTab === 'categories' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textAlign: 'left',
                  transition: 'background-color 0.2s'
                }}
              >
                <FaListUl style={{ marginRight: isSidebarCollapsed ? 0 : '0.75rem', fontSize: '1.25rem' }} />
                {!isSidebarCollapsed && <span>Categories</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <header style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
            {activeTab === 'notes' ? 'Notes' : 'Categories'}
          </h1>
        </header>

        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'notes' ? (
            <>
              {/* Add Note Form */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>Add New Note</h2>
                <form onSubmit={addNote}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      Title <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter note title"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter note description"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        fontSize: '1rem',
                        resize: 'vertical',
                        minHeight: '80px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#40a9ff'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1890ff'}
                  >
                    <FaPlus />
                    <span>Add Note</span>
                  </button>
                </form>
              </div>

              {/* Notes List */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>Your Notes</h2>
                
                {notes.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#8c8c8c',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '4px'
                  }}>
                    No notes yet. Add your first note above!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {notes.map(note => (
                      <div 
                        key={note.id}
                        style={{
                          padding: '1rem',
                          border: '1px solid #f0f0f0',
                          borderRadius: '4px',
                          backgroundColor: '#fafafa',
                          transition: 'box-shadow 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                      >
                        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#333' }}>{note.title}</h3>
                        <p style={{ margin: '0.5rem 0', color: '#595959' }}>{note.description}</p>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '0.75rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #f0f0f0',
                          fontSize: '0.875rem',
                          color: '#8c8c8c'
                        }}>
                          <span>
                            Category: {categories.find(cat => cat.id === note.category_id)?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <CategoryManager 
                categories={categories} 
                setCategories={setCategories}
                fetchNotes={fetchNotes}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
