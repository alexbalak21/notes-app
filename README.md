# Notes Application

A modern, full-stack notes application built with React, Vite, Material-UI, and Flask. Organize your notes with custom categories and colors in a clean, intuitive interface.

## ✨ Features

- 📝 **Note Management**
  - Create, edit, and delete notes
  - Rich text formatting support
  - Markdown support
  
- 🏷️ **Categories**
  - Create custom categories
  - Assign colors to categories
  - Filter notes by category
  
- 🎨 **Customization**
  - Color-coded categories
  - Clean, modern UI with Material-UI
  - Responsive design for all devices
  
- ⚡ **Performance**
  - Built with Vite for fast development
  - Optimized production builds
  - Efficient state management

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 18
- 🎨 Material-UI (MUI)
- 🔄 React Router
- 📡 Axios for API calls
- 🎯 Vite build tool

**Backend**
- 🐍 Python 3
- 🌶️ Flask
- 🗄️ SQLite Database
- 🔄 Flask-CORS for cross-origin requests

**Development Tools**
- 🛠️ npm / yarn
- 🧪 ESLint
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
