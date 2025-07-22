# Notes App Search Functionality

This document explains how the search functionality works in the Notes application.

## Overview

The search feature allows users to filter notes in real-time based on their input. It searches through note titles, descriptions, and tags.

## How It Works

### Search Fields
1. **Title**: Matches text in the note's title
2. **Description**: Matches text in the note's description/content
3. **Tags**: Matches any tag associated with the note (if tags are implemented)

### Search Behavior
- **Case Insensitive**: Searches are not case-sensitive (searching for "note" will match "Note", "NOTE", etc.)
- **Partial Matches**: Returns notes where the search term appears anywhere in the field
- **Real-time**: Results update as you type
- **Whitespace Handling**: Leading/trailing spaces are trimmed from the search term

### Implementation Details

The search is implemented in `frontend/src/pages/Home.jsx` and uses the following logic:

```javascript
// Filter notes based on search query
const filteredNotes = notes.filter(note => {
  const lowercasedQuery = searchQuery.toLowerCase().trim();
  
  // Check title
  if (note.title && note.title.toLowerCase().includes(lowercasedQuery)) {
    return true;
  }
  
  // Check description
  if (note.description && note.description.toLowerCase().includes(lowercasedQuery)) {
    return true;
  }
  
  // Check tags if they exist
  if (Array.isArray(note.tags)) {
    return note.tags.some(tag => 
      tag && tag.toLowerCase().includes(lowercasedQuery)
    );
  }
  
  return false;
});
```

### User Interface
- The search bar is located at the top of the notes list
- A search icon appears on the left side of the input field
- A submit button (→) appears on the right when there's text in the search field
- Results update in real-time as you type

## Example Searches

- Search for "meeting" to find all notes with "meeting" in the title or description
- Search for "#work" to find all notes tagged with "work"
- Search for "2023" to find all notes containing "2023" in any field

## Performance Considerations
- The search is performed client-side for immediate feedback
- The search is optimized to handle large numbers of notes efficiently
- The search is debounced to prevent excessive re-renders

## Future Improvements
- Add search filters (e.g., search only in titles, only in descriptions, etc.)
- Support for more complex search queries (AND/OR, exact phrases, etc.)
- Search history and saved searches
- Keyboard shortcuts for focusing the search field
