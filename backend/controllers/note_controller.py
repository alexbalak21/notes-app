from flask import Blueprint, request, jsonify
from models.note import Note
from repositories.note_repository import NoteRepository
from repositories.category_repository import CategoryRepository
from datetime import datetime

note_bp = Blueprint("notes", __name__, url_prefix="/api/notes")


@note_bp.route("", methods=["GET"])
@note_bp.route("/", methods=["GET"])
def get_notes():
    notes = NoteRepository.get_all()
    return jsonify([n.to_dict() for n in notes])


@note_bp.route("<int:note_id>", methods=["GET"])
def get_note(note_id):
    note = NoteRepository.get_by_id(note_id)
    return jsonify(note.to_dict()) if note else (jsonify({"error": "Not found"}), 404)


@note_bp.route("", methods=["POST"])
@note_bp.route("/", methods=["POST"])
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


@note_bp.route("<int:note_id>", methods=["PUT"])
def update_note(note_id):
    note = NoteRepository.get_by_id(note_id)
    if not note:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()

    # Update category
    if "category_id" in data:
        category_input = data["category_id"]
        if isinstance(category_input, str):
            cat = CategoryRepository.get_by_name(category_input)
            note.category = cat.id if cat else 1
        else:
            note.category = category_input or 1

    # Update title
    if "title" in data:
        note.title = data["title"]

    # Update description
    if "description" in data:
        note.description = data["description"]

    # Update timestamp
    note.updated_at = datetime.utcnow()

    NoteRepository.update()
    return jsonify(note.to_dict()), 200


@note_bp.route("<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    note = NoteRepository.get_by_id(note_id)
    if not note:
        return jsonify({"error": "Not found"}), 404

    NoteRepository.delete(note)
    return jsonify({"message": "Note deleted successfully"}), 200
