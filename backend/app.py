from flask import Flask, jsonify, request, make_response
from datetime import datetime

app = Flask(__name__)

# In-memory notes store
notes = [
    {
        "id": 1,
        "category": "Work",
        "title": "Finish report",
        "description": "Complete the quarterly report by Friday.",
        "created_at": "2023-08-01T09:00:00Z",
        "updated_at": "2023-08-01T09:00:00Z"
    },
    {
        "id": 2,
        "category": "Personal",
        "title": "Grocery list",
        "description": "Milk, eggs, bread, and coffee.",
        "created_at": "2023-08-01T10:00:00Z",
        "updated_at": "2023-08-01T10:00:00Z"
    }
]

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@app.route('/api/notes', methods=['OPTIONS'])
def handle_notes_options():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    note = next((n for n in notes if n['id'] == note_id), None)
    return jsonify(note) if note else (jsonify({"error": "Note not found"}), 404)

@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.get_json()
    now = datetime.utcnow().isoformat() + "Z"
    new_note = {
        "id": len(notes) + 1,
        "category": data.get("category", "Uncategorized"),
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "created_at": now,
        "updated_at": now
    }
    notes.append(new_note)
    return jsonify(new_note), 201

if __name__ == '__main__':
    app.run(debug=True)
