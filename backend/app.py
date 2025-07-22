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
    },
    {
        "id": 3,
        "category": "Work",
        "title": "Team meeting",
        "description": "Discuss project milestones with the team on Tuesday.",
        "created_at": "2023-08-02T08:30:00Z",
        "updated_at": "2023-08-02T08:30:00Z"
    },
    {
        "id": 4,
        "category": "Personal",
        "title": "Call mom",
        "description": "Catch up with mom over the phone in the evening.",
        "created_at": "2023-08-02T09:15:00Z",
        "updated_at": "2023-08-02T09:15:00Z"
    },
    {
        "id": 5,
        "category": "Work",
        "title": "Client follow-up",
        "description": "Email the client for feedback on the latest draft.",
        "created_at": "2023-08-02T10:00:00Z",
        "updated_at": "2023-08-02T10:00:00Z"
    },
    {
        "id": 6,
        "category": "Personal",
        "title": "Workout",
        "description": "Go for a 30-minute run in the park.",
        "created_at": "2023-08-02T11:00:00Z",
        "updated_at": "2023-08-02T11:00:00Z"
    },
    {
        "id": 7,
        "category": "Work",
        "title": "Review budget",
        "description": "Check department expenses and update budget sheet.",
        "created_at": "2023-08-02T12:00:00Z",
        "updated_at": "2023-08-02T12:00:00Z"
    },
    {
        "id": 8,
        "category": "Personal",
        "title": "Book dentist appointment",
        "description": "Schedule cleaning for next week.",
        "created_at": "2023-08-02T13:00:00Z",
        "updated_at": "2023-08-02T13:00:00Z"
    },
    {
        "id": 9,
        "category": "Work",
        "title": "Prepare slides",
        "description": "Design presentation slides for Monday's pitch.",
        "created_at": "2023-08-02T14:00:00Z",
        "updated_at": "2023-08-02T14:00:00Z"
    },
    {
        "id": 10,
        "category": "Personal",
        "title": "Pick up dry cleaning",
        "description": "Collect clothes from the cleaner by 6 PM.",
        "created_at": "2023-08-02T15:00:00Z",
        "updated_at": "2023-08-02T15:00:00Z"
    },
    {
        "id": 11,
        "category": "Work",
        "title": "Update LinkedIn",
        "description": "Add recent achievements to LinkedIn profile.",
        "created_at": "2023-08-02T16:00:00Z",
        "updated_at": "2023-08-02T16:00:00Z"
    },
    {
        "id": 12,
        "category": "Personal",
        "title": "Read book",
        "description": "Finish reading the last two chapters of your novel.",
        "created_at": "2023-08-02T17:00:00Z",
        "updated_at": "2023-08-02T17:00:00Z"
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
