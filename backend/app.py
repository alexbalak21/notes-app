from flask import Flask, jsonify, request, make_response
from datetime import datetime

app = Flask(__name__)

notes = [
    {
        "id": 1,
        "category": "Work",
        "title": "Finish report",
        "description": "Complete the quarterly report by Friday.",
        "updated_at": "2023-08-01T09:00:00Z"
    },
    {
        "id": 2,
        "category": "Personal",
        "title": "Grocery list",
        "description": "Milk, eggs, bread, and coffee.",
        "updated_at": "2023-08-01T10:00:00Z"
    },
    {
        "id": 3,
        "category": "Health",
        "title": "Doctor Appointment",
        "description": "Annual checkup on Monday at 3pm.",
        "updated_at": "2023-08-02T14:00:00Z"
    },
    {
        "id": 4,
        "category": "Home",
        "title": "Fix leaky faucet",
        "description": "Call plumber or try DIY fix.",
        "updated_at": "2023-08-03T08:30:00Z"
    },
    {
        "id": 5,
        "category": "Fitness",
        "title": "Gym schedule",
        "description": "Workout Tue, Thu, Sat — leg day on Thursday!",
        "updated_at": "2023-08-04T07:15:00Z"
    },
    {
        "id": 6,
        "category": "Travel",
        "title": "Paris itinerary",
        "description": "Book Eiffel Tower tickets, explore Le Marais.",
        "updated_at": "2023-08-05T11:45:00Z"
    },
    {
        "id": 7,
        "category": "Study",
        "title": "Python course",
        "description": "Finish modules 4 and 5 by Sunday.",
        "updated_at": "2023-08-06T13:00:00Z"
    },
    {
        "id": 8,
        "category": "Events",
        "title": "Birthday party",
        "description": "Emma’s birthday at the park on Saturday.",
        "updated_at": "2023-08-07T15:20:00Z"
    },
    {
        "id": 9,
        "category": "Finance",
        "title": "Pay bills",
        "description": "Electricity, water, and internet due next week.",
        "updated_at": "2023-08-08T09:10:00Z"
    },
    {
        "id": 10,
        "category": "Ideas",
        "title": "Startup pitch",
        "description": "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. More info here. lorem labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. More info here. lorem labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. More info here. lorem labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip",
        "updated_at": "2023-08-09T17:40:00Z"
    }
]


@app.after_request
def add_cors_headers(response):
    if request.method == 'OPTIONS':
        response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

@app.route('/api/notes', methods=['OPTIONS'])
def handle_notes_options():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@app.route('/api/notes/<int:note_id>', methods=['OPTIONS'])
def handle_note_options(note_id):
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, DELETE, OPTIONS'
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
    new_id = max((note["id"] for note in notes), default=0) + 1
    new_note = {
        "id": new_id,
        "category": data.get("category", "Uncategorized"),
        "title": data.get("title", ""),
        "description": data.get("description", ""),
        "updated_at": now
    }
    notes.append(new_note)
    return jsonify(new_note), 201

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = next((n for n in notes if n['id'] == note_id), None)
    if note:
        notes.remove(note)
        return jsonify({"message": "Note deleted successfully"}), 200
    else:
        return jsonify({"error": "Note not found"}), 404

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.get_json()
    note = next((n for n in notes if n['id'] == note_id), None)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    # Update the note fields if provided
    note['category'] = data.get('category', note['category'])
    note['title'] = data.get('title', note['title'])
    note['description'] = data.get('description', note['description'])
    note['updated_at'] = datetime.utcnow().isoformat() + "Z"

    return jsonify(note), 200


if __name__ == '__main__':
    app.run(debug=True)
