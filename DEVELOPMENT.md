# Development Guide

This document provides detailed information for developers working on the Notes Application. It covers the project structure, setup instructions, coding standards, and contribution guidelines.

## 🗂 Project Structure

```
notes-app/
├── backend/                 # Flask backend server
│   ├── app.py              # Main Flask application
│   ├── cors.py             # CORS configuration
│   ├── requirements.txt    # Python dependencies
│   ├── req.txt            # Alternative requirements file
│   ├── .flaskenv          # Flask environment variables
│   └── request.rest       # API request examples
│
├── frontend/               # React frontend (Vite)
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Root component
│   │   ├── main.jsx        # Application entry point
│   │   └── theme.js        # MUI theme configuration
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js      # Vite configuration
│   └── ...
│
├── .gitignore
├── README.md               # Project documentation
└── DEVELOPMENT.md          # This file
```

## 🛠 Development Setup

### Backend Development

1. **Environment Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create and activate virtual environment
   python -m venv venv
   # On Windows: .\venv\Scripts\activate
   # On macOS/Linux: source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Running the Server**
   ```bash
   # Development mode with auto-reload
   flask --app app.py --debug run
   
   # Or directly with Python
   # python app.py
   ```
   The backend will be available at `http://localhost:5000`

3. **API Endpoints**
   - `GET /api/notes` - Get all notes
   - `POST /api/notes` - Create a new note
   - `GET /api/notes/<id>` - Get a specific note
   - `PUT /api/notes/<id>` - Update a note
   - `DELETE /api/notes/<id>` - Delete a note

4. **Environment Variables**
   Create a `.env` file in the backend directory with:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key
   ```

### Frontend Development

1. **Install Dependencies**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install  # or yarn install
   ```

2. **Running the Development Server**
   ```bash
   # Start Vite development server
   npm run dev
   ```
   The app will be available at `http://localhost:3000` with hot module replacement.

3. **Available Scripts**
   ```bash
   # Start development server
   npm run dev
   
   # Build for production
   npm run build
   
   # Preview production build
   npm run preview
   
   # Lint code
   npm run lint
   
   # Run tests
   npm test
   ```

## 🎨 Code Style

### Frontend Guidelines
- **Components**
  - Use functional components with hooks
  - Follow React best practices and patterns
  - Keep components small and focused
  - Use meaningful, descriptive names

- **Styling**
  - Use Material-UI components and theming
  - Follow the existing design system
  - Use the `sx` prop for custom styles
  - Keep styles close to components

- **State Management**
  - Use React Context for global state
  - Keep component state local when possible
  - Use meaningful state and setter names

### Backend Guidelines
- **Code Style**
  - Follow PEP 8 style guide
  - Use type hints for better code clarity
  - Keep functions small and focused
  - Use docstrings for public methods

- **API Design**
  - Follow RESTful conventions
  - Use proper HTTP status codes
  - Implement proper error handling
  - Validate all input data

- **Database**
  - Use SQLAlchemy for database operations
  - Keep models in separate files
  - Use migrations for schema changes

## 🔄 Git Workflow

1. **Branch Naming**
   ```
   feature/  - New features
   bugfix/   - Bug fixes
   hotfix/   - Critical production fixes
   chore/    - Maintenance tasks
   docs/     - Documentation updates
   refactor/ - Code refactoring
   ```

2. **Commit Messages**
   Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   ```
   <type>(<scope>): <short description>
   
   [optional body]
   
   [optional footer]
   ```
   
   **Types**:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code changes that neither fix bugs nor add features
   - `test`: Adding or modifying tests
   - `chore`: Changes to the build process or auxiliary tools

3. **Pull Requests**
   - Keep PRs small and focused
   - Include a clear description of changes
   - Reference related issues
   - Request reviews from team members
   - Ensure all tests pass before merging

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
python -m pytest
```

## Deployment

### Production Build
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The built files will be in the `frontend/dist` directory

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URI=sqlite:///notes.db
```

## 🐛 Troubleshooting

### Common Issues

#### Frontend
- **Dependency Issues**
  ```bash
  # Delete node_modules and reinstall
  rm -rf node_modules package-lock.json
  npm install
  ```

- **Build Failures**
  - Check for TypeScript/ESLint errors
  - Ensure all dependencies are installed
  - Clear Vite cache if needed: `rm -rf node_modules/.vite`

#### Backend
- **Database Issues**
  ```bash
  # Delete the database and restart
  rm -f instance/notes.db
  flask init-db  # If you have this command
  ```

- **Virtual Environment**
  Make sure to activate the virtual environment:
  ```bash
  # On Windows
  .\venv\Scripts\activate
  
  # On macOS/Linux
  source venv/bin/activate
  ```

- **Port Already in Use**
  ```bash
  # Find and kill the process
  lsof -i :5000  # For macOS/Linux
  # or
  netstat -ano | findstr :5000  # For Windows
  
  # Then kill the process ID
  kill <PID>  # macOS/Linux
  taskkill /PID <PID> /F  # Windows
  ```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**
   - Check if the issue already exists
   - Provide detailed reproduction steps
   - Include browser/OS information

2. **Suggest Enhancements**
   - Open an issue to discuss the feature
   - Keep the scope focused
   - Consider backward compatibility

3. **Pull Requests**
   - Fork the repository
   - Create a feature branch
   - Write tests for new features
   - Update documentation
   - Submit a pull request

4. **Code Review**
   - Be respectful and constructive
   - Focus on the code, not the person
   - Suggest improvements clearly

## 📚 Resources

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📬 Contact

For questions or support, please [open an issue](https://github.com/yourusername/notes-app/issues).

---

<div align="center">
  Made with ❤️ by [Your Name]
</div>
