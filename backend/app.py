from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import atexit
from dotenv import load_dotenv
from cors import init_cors, handle_notes_options, handle_note_options, handle_categories_options

# Load environment variables from .flaskenv file
load_dotenv()

app = Flask(__name__)

# Configure MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', '3306')}/{os.getenv('MYSQL_DB')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Initialize CORS
init_cors(app)

# Define Note model
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False, default='')
    description = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        # Get the category name using the relationship
        category = Category.query.get(self.category)
        return {
            'id': self.id,
            'category': category.name if category else 'Uncategorized',
            'category_id': int(self.category),  # Convert to integer
            'title': self.title,
            'description': self.description,
            'updated_at': self.updated_at.isoformat() + 'Z'
        }

# Define Category model
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(7), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color
        }

# Default categories configuration
DEFAULT_CATEGORIES = [
    {"name": "Misc", "color": "#9e9e9e"},        # Gray
    {"name": "Work", "color": "#2196f3"},          # Blue
    {"name": "Personal", "color": "#4caf50"},      # Green
    {"name": "Ideas", "color": "#9c27b0"},         # Purple
    {"name": "Shopping", "color": "#ff9800"},      # Orange
    {"name": "Important", "color": "#f44336"}      # Red
]

# Create tables
def init_db():
    with app.app_context():
        db.create_all()
        
        # Add default categories if none exist
        if not Category.query.first():
            for cat_data in DEFAULT_CATEGORIES:
                category = Category(
                    name=cat_data['name'],
                    color=cat_data['color']
                )
                db.session.add(category)
            db.session.commit()
            
        # If no notes exist, add some sample data
        if not Note.query.first():
            # Get the default category (Misc)
            default_cat = Category.query.filter_by(name="Misc").first()
            
            sample_notes = [
                {
                    "id": 1,
                    "category": default_cat.id if default_cat else 1,
                    "title": "Welcome to Notes App",
                    "description": "This is your first note. You can edit or delete it."
                },
                {
                    "id": 2,
                    "category": default_cat.id if default_cat else 2,
                    "title": "An example note",
                    "description": "This is an example note. You can edit or delete it."
                },
            ]
            
            for note_data in sample_notes:
                note = Note(
                    id=note_data['id'],
                    category=note_data['category'],
                    title=note_data['title'],
                    description=note_data['description'],
                    updated_at=datetime.utcnow()
                )
                db.session.add(note)
            db.session.commit()

from sqlalchemy import text

def cleanup():
    """Clean up the database when the application shuts down"""
    with app.app_context():
        try:
            print("\nCleaning up database...")
            
            # Disable foreign key checks if using MySQL/MariaDB
            if 'mysql' in app.config['SQLALCHEMY_DATABASE_URI'].lower():
                db.session.execute(text('SET FOREIGN_KEY_CHECKS = 0;'))
            
            # Truncate tables (this will also reset auto-increment counters)
            db.session.execute(text('TRUNCATE TABLE note;'))
            db.session.execute(text('TRUNCATE TABLE category;'))
            
            # Re-enable foreign key checks if using MySQL/MariaDB
            if 'mysql' in app.config['SQLALCHEMY_DATABASE_URI'].lower():
                db.session.execute(text('SET FOREIGN_KEY_CHECKS = 1;'))
                
            db.session.commit()
            print("Database tables truncated successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"Error during cleanup: {e}")
        finally:
            db.session.close()

# Register the cleanup function to run when the app shuts down
atexit.register(cleanup)

# Initialize the database
init_db()

# CORS preflight handlers
@app.route('/api/notes', methods=['OPTIONS'])
def handle_notes_options_route():
    return handle_notes_options()

@app.route('/api/notes/<int:note_id>', methods=['OPTIONS'])
def handle_note_options_route(note_id):
    return handle_note_options(note_id)

@app.route('/api/notes', methods=['GET'])
def get_notes():
    notes = Note.query.all()
    return jsonify([note.to_dict() for note in notes])

@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    note = Note.query.get(note_id)
    return jsonify(note.to_dict()) if note else (jsonify({"error": "Note not found"}), 404)

@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.get_json()
    new_note = Note(
        category=data.get("category", "Misc"),
        title=data.get("title", ""),
        description=data.get("description", ""),
        updated_at=datetime.utcnow()
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict()), 201

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Note.query.get(note_id)
    if note:
        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Note deleted successfully"}), 200
    else:
        return jsonify({"error": "Note not found"}), 404

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    data = request.get_json()
    
    # Update the note fields if provided
    if 'category' in data:
        note.category = data['category']
    if 'title' in data:
        note.title = data['title']
    if 'description' in data:
        note.description = data['description']
    
    note.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(note.to_dict()), 200

# Category endpoints
@app.route('/api/categories', methods=['OPTIONS'])
def handle_categories_options_route():
    return handle_categories_options()

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    
    # Validate required fields
    if not data or 'name' not in data or 'color' not in data:
        return jsonify({"error": "Name and color are required"}), 400
    
    # Check if category with this name already exists
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({"error": "A category with this name already exists"}), 400
    
    # Create new category
    new_category = Category(
        name=data['name'],
        color=data['color']
    )
    
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify(new_category.to_dict()), 201

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])
