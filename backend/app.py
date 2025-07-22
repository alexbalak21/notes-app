from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory notes store
notes = [
    {
        "id": 1,
        "category": "Work",
        "title": "Finish report",
        "description": "Complete the quarterly report by Friday."
    },
    {
        "id": 2,
        "category": "Personal",
        "description": "Milk, eggs, bread, and coffee."
    }
]

# GET all notes


@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

# GET a single note by ID


@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    note = next((n for n in notes if n['id'] == note_id), None)
    return jsonify(note) if note else (jsonify({"error": "Note not found"}), 404)

# POST a new note


@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.get_json()
    new_note = {
        "id": len(notes) + 1,
        "category": data.get("category", "Uncategorized"),
        "title": data.get("title", ""),
        "description": data.get("description", "")
    }
    notes.append(new_note)
    return jsonify(new_note), 201


if __name__ == '__main__':
    app.run(debug=True)
