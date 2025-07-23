from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
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
        return {
            'id': self.id,
            'category': self.category,
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

# Create tables
def init_db():
    with app.app_context():
        db.create_all()
        # If no notes exist, add some sample data
        if not Note.query.first():
            sample_notes = [
                {"id": 1, "category": "Work", "title": "Finish report", "description": "Complete the quarterly report by Friday."},
                {"id": 2, "category": "Personal", "title": "Grocery list", "description": "Milk, eggs, bread, and coffee."},
                # Add other sample notes here
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

# Initialize the database
init_db()

# Database models and initialization are now at the top of the file


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
        category=data.get("category", "Uncategorized"),
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

