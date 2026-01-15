# Notes App - Frontend

A modern, responsive notes application built with React, Vite, and Material-UI. This frontend application allows users to create, read, update, and delete notes with categories.

### Notes App Live

🌐 **Live App:** https://notes-app.alwaysdata.net/


### Screenshot
![App Screenshot](../project_images/screenshoot.png)

## Features

- 📝 Create and manage notes with titles and descriptions
- 🗂️ Organize notes into categories
- 🎨 Clean and responsive Material-UI design
- 🔍 Search and filter functionality
- 🌓 Dark/Light mode support
- 📱 Mobile-friendly interface

## Tech Stack

- ⚛️ React 19
- 🚀 Vite
- 🎨 Material-UI (MUI) v7
- 🔄 React Router v7
- 📡 Axios for API requests
- 🎨 Emotion for styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/notes-app.git
   cd notes-app/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure environment variables
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Note.jsx    # Note component
│   │   └── ...
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/           # Static assets
└── package.json      # Project dependencies and scripts
```

## API Integration

The frontend communicates with a RESTful API. Ensure the API server is running and properly configured.

### Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/categories` - Get all categories

## Styling

This project uses Emotion with Material-UI for styling. The theming system supports both light and dark modes.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
