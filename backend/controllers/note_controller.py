from flask import Blueprint, request, jsonify
from models.note import Note
from repositories.note_repository import NoteRepository
from repositories.category_repository import CategoryRepository
from datetime import datetime

note_bp = Blueprint("notes", __name__, url_prefix="/api/notes")


@note_bp.get("/")
def get_notes():
    notes = NoteRepository.get_all()
    return jsonify([n.to_dict() for n in notes])


@note_bp.get("/<int:note_id>")
def get_note(note_id):
    note = NoteRepository.get_by_id(note_id)
    return jsonify(note.to_dict()) if note else (jsonify({"error": "Not found"}), 404)


@note_bp.post("/")
def add_note():
    data = request.get_json()
    category_input = data.get("category_id")

    if isinstance(category_input, str):
        cat = CategoryRepository.get_by_name(category_input)
        category_id = cat.id if cat else 1
    else:
        category_id = category_input or 1

    note = Note(
        category=category_id,
        title=data.get("title", ""),
        description=data.get("description", ""),
        updated_at=datetime.utcnow()
    )

    NoteRepository.create(note)
    return jsonify(note.to_dict()), 201
