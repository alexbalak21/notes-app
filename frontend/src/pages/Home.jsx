import { useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import TopBar from '../components/TopBar';
import AddNote from '../components/AddNote';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

    const handleAddNote = (newNote) => {
        setNotes([...notes, { ...newNote, id: Date.now() }]);
        setIsAddNoteOpen(false); // close dialog after adding
    };

    const handleOpenAddNote = () => setIsAddNoteOpen(true);
    const handleCloseAddNote = () => setIsAddNoteOpen(false);

    return (
        <Box sx={{ bgcolor: 'bg', minHeight: '100vh', pb: 8 }}>
            <TopBar onAddClick={handleOpenAddNote} />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {notes.map((note) => (
                        <Grid item key={note.id} xs={12} sm={6} md={4}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '200px',
                                }}
                            >
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {note.title}
                                </Typography>
                                <Typography variant="body1" sx={{ flexGrow: 1, whiteSpace: 'pre-line' }}>
                                    {note.content}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, alignSelf: 'flex-end' }}>
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <AddNote
                onAddNote={handleAddNote}
                open={isAddNoteOpen}
                onClose={handleCloseAddNote}
            />
        </Box>
    );
};

export default Home;
