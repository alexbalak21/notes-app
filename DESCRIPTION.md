# Notes Application - Frontend Documentation

## Overview

The Notes Application is a responsive, single-page application built with React and Material-UI. It allows users to create, view, edit, and delete notes with custom categories and colors. The application features a clean, modern UI with light/dark theme support.



## Application Architecture

### Component Hierarchy

```
App
├── ResponsiveAppBar (Navigation)
├── Home (Main Page)
│   ├── TopBar (Search and Actions)
│   │   ├── SearchBar
│   │   └── SelectBar (Category Filter)
│   ├── Notes Grid/List
│   │   └── Note (Individual Note Component)
│   └── AddNote (Modal)
├── Login (Authentication)
└── ThemeProvider (Theme Context)
```

## Core Components

### 1. App (`App.jsx`)
- **Purpose**: Root component that sets up routing and theme
- **Key Features**:
  - Manages application routing
  - Provides theme context to all child components
  - Handles authentication state

### 2. ResponsiveAppBar (`components/ResponsiveAppBar.jsx`)
- **Purpose**: Main navigation bar
- **Key Features**:
  - Responsive design (collapses on mobile)
  - Navigation links
  - Theme toggle button
  - User menu (when authenticated)
- **Props**:
  - `onThemeToggle`: Function to switch between light/dark themes
  - `isAuthenticated`: Boolean indicating user login status

### 3. Home (`pages/Home.jsx`)
- **Purpose**: Main page displaying notes and controls
- **State Management**:
  - Manages notes list
  - Handles search and filter states
  - Controls AddNote modal visibility
- **Key Features**:
  - Displays notes in a responsive grid/list
  - Handles note selection and actions
  - Manages search and filtering

### 4. TopBar (`components/TopBar.jsx`)
- **Purpose**: Contains search and action buttons
- **Components**:
  - `SearchBar`: For searching notes
  - `SelectBar`: For filtering notes by category
- **Behavior**:
  - Updates search term in parent component
  - Handles filter changes

### 5. SearchBar (`components/SearchBar.jsx`)
- **Purpose**: Search functionality for notes
- **Features**:
  - Debounced search input
  - Clear button
  - Responsive design
- **Props**:
  - `onSearch`: Callback when search term changes
  - `searchTerm`: Current search term

### 6. SelectBar (`components/SelectBar.jsx`)
- **Purpose**: Filter notes by category
- **Features**:
  - Dropdown with all available categories
  - Visual indicator of selected category
- **Props**:
  - `categories`: Array of available categories
  - `onCategoryChange`: Callback when category changes
  - `selectedCategory`: Currently selected category

### 7. Note (`components/Note.jsx`)
- **Purpose**: Displays a single note
- **Features**:
  - Displays note title, content, and category
  - Shows creation/update time
  - Edit and delete actions
  - Responsive card layout
- **Props**:
  - `note`: Note object with title, content, category, etc.
  - `onEdit`: Callback for edit action
  - `onDelete`: Callback for delete action

### 8. AddNote (`components/AddNote.jsx`)
- **Purpose**: Modal for adding/editing notes
- **Features**:
  - Form with title and content fields
  - Category selection with color indicators
  - New category creation with color picker
  - Form validation
  - Responsive dialog
- **State**:
  - Manages form inputs
  - Toggles new category form
  - Handles color selection

### 9. CategoryChip (`components/CategoryChip.jsx`)
- **Purpose**: Displays a category with its color
- **Features**:
  - Shows category name with colored dot
  - Clickable for filtering
- **Props**:
  - `category`: Category name
  - `color`: Category color
  - `onClick`: Click handler

### 10. ThemeToggle (`components/ThemeToggle/`)
- **Purpose**: Toggle between light and dark themes
- **Features**:
  - Sun/moon icon that changes based on current theme
  - Smooth transition between themes
- **Uses**: `ThemeContext` for theme management

## State Management

### Theme Context (`contexts/ThemeContext.jsx`)
- **Purpose**: Manages application theme
- **Features**:
  - Persists theme preference in localStorage
  - Provides theme and toggle function to all components
- **Hook**: `useTheme()` - returns `{ theme, toggleTheme }`

### Local State
- Most components use React's `useState` for local state management
- State lifting is used to share state between parent and child components
- Form state is managed locally within form components

## Styling

- **Material-UI**: Components are styled using Material-UI's `sx` prop and `styled` API
- **Theming**: Custom theme configuration in `theme.js`
- **Responsive Design**: Uses Material-UI's `useMediaQuery` and breakpoints

## Key Features and Behaviors

### 1. Theme Switching
- Toggle between light and dark themes
- Theme preference is saved in localStorage
- Smooth transitions between themes

### 2. Note Management
- **Create**: Add new notes with title, content, and category
- **Read**: View notes in a responsive grid/list
- **Update**: Edit existing notes
- **Delete**: Remove notes with confirmation

### 3. Search and Filter
- Search notes by title or content
- Filter notes by category
- Combine search and filter for precise results

### 4. Category Management
- Create new categories with custom colors
- Assign categories to notes
- Filter notes by category

### 5. Responsive Design
- Adapts to different screen sizes
- Mobile-friendly navigation
- Optimized touch targets for mobile devices

## Component Interactions

1. **Adding a Note**:
   - User clicks "Add Note" button
   - `AddNote` modal opens
   - User fills in details and submits
   - New note appears in the grid

2. **Searching Notes**:
   - User types in search bar
   - `SearchBar` debounces input
   - `Home` component filters notes based on search term

3. **Filtering by Category**:
   - User selects a category from `SelectBar`
   - `Home` component filters notes by selected category

4. **Theme Toggling**:
   - User clicks theme toggle button
   - `ThemeContext` updates the theme
   - All components re-render with new theme

## Accessibility
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Sufficient color contrast
- Focus management for modals and dialogs

## Performance Considerations
- Memoized components with `React.memo`
- Debounced search input
- Lazy loading for routes
- Optimized re-renders with proper dependency arrays

## Dependencies
- React 18
- Material-UI (MUI) v5
- React Router DOM
- Axios for API calls
- date-fns for date formatting

## Future Improvements
1. Add note archiving
2. Implement note sharing
3. Add rich text editing
4. Support for note tags
5. Offline support with service workers

---

This documentation provides a comprehensive overview of the frontend architecture and components. For implementation details, refer to the source code and component documentation.
