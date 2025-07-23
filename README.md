# Notes Application

A modern, full-stack notes application built with React, Vite, Material-UI, and Flask. Organize your notes with custom categories and colors in a clean, intuitive interface.

## ✨ Features

- 📝 **Note Management**
  - Create, edit, and delete notes
  - Rich text formatting support
  - Character limit with counter
  - Responsive card layout
  
- 🏷️ **Categories**
  - Create custom categories with colors
  - Automatic 'All' category
  - Filter notes by category
  - Color-coded category indicators
  
- 🔍 **Search & Filter**
  - Real-time search across titles and content
  - Combine search with category filters
  - Clear search functionality
  
- 🎨 **UI/UX**
  - Clean, modern interface with Material-UI
  - Responsive design for all devices
  - Smooth animations and transitions
  - Intuitive category management
  
- ⚡ **Performance**
  - Optimized rendering with React hooks
  - Efficient state management
  - Fast API responses with Flask
  - Built with Vite for rapid development

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 18 with Hooks
- 🎨 Material-UI (MUI) v5
- 🔄 React Router v6
- 📡 Axios for API communication
- 🎯 Vite for ultra-fast development
- 🎨 Emotion for styling
- 🔍 Custom hooks for data management

**Backend**
- 🐍 Python 3
- 🌶️ Flask RESTful API
- 🗄️ SQLite Database
- 🔄 Flask-CORS for secure cross-origin requests
- 🏗️ RESTful endpoints for notes and categories

**State Management**
- React Context API
- Custom hooks for data fetching
- Optimistic UI updates

**Development Tools**
- 🛠️ npm / yarn package management
- 🧪 ESLint for code quality
- 🔍 React Developer Tools
- 🌐 Browser DevTools
- 🔄 Hot Module Replacement (HMR)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Python (v3.8 or later)
- npm (comes with Node.js) or yarn
- Git (for version control)

### 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notes-app.git
   cd notes-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   # On Windows: .\venv\Scripts\activate
   # On macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install  # or yarn install
   ```

### 🏃 Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   # On Windows: .\venv\Scripts\activate
   # On macOS/Linux: source venv/bin/activate
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev  # or yarn dev
   ```
   The frontend will be available at `http://localhost:3000`

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📬 Contact

For any questions or suggestions, please open an issue or submit a pull request.

---

<div align="center">
  Made with ❤️ by [Your Name]
</div>
