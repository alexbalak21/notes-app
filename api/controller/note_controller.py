from flask import Blueprint, jsonify, request
from datetime import datetime
from sqlalchemy.orm import scoped_session
from model.Note import Note

# Create a Blueprint for note routes
note_bp = Blueprint('note', __name__)

def init_note_controller(app, db_session):
    """Initialize the note controller with the app and database session"""
    global Session
    Session = db_session
    app.register_blueprint(note_bp, url_prefix='/api/notes')

# Get all notes
@note_bp.route('', methods=['GET'])
def get_notes():
    session = Session()
    try:
        notes = session.query(Note).all()
        return jsonify([note.to_dict() for note in notes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Get a single note by ID
@note_bp.route('/<int:note_id>', methods=['GET'])
def get_note(note_id):
    session = Session()
    try:
        note = session.query(Note).get(note_id)
        if note:
            return jsonify(note.to_dict())
        else:
            return jsonify({"error": "Note not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Create a new note
@note_bp.route('', methods=['POST'])
def add_note():
    session = Session()
    try:
        data = request.get_json()
        
        # Validate required fields
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        
        if not title:
            return jsonify({"error": "Title is required"}), 400
        if not description:
            return jsonify({"error": "Description is required"}), 400
            
        new_note = Note(
            title=title,
            description=description,
            category_id=data.get("category_id", 1),
            updated_on=datetime.utcnow()
        )
        session.add(new_note)
        session.commit()
        return jsonify(new_note.to_dict()), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Update an existing note
@note_bp.route('/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    session = Session()
    try:
        note = session.query(Note).get(note_id)
        if note:
            data = request.get_json()
            note.title = data.get('title', note.title)
            note.description = data.get('description', note.description)
            note.category_id = data.get('category_id', note.category_id)
            note.updated_on = datetime.utcnow()
            session.commit()
            return jsonify(note.to_dict())
        else:
            return jsonify({"error": "Note not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Delete a note
@note_bp.route('/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    session = Session()
    try:
        note = session.query(Note).get(note_id)
        if note:
            session.delete(note)
            session.commit()
            return jsonify({"message": "Note deleted successfully"}), 200
        else:
            return jsonify({"error": "Note not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
