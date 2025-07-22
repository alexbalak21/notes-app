from flask import make_response, request

def init_cors(app):
    """
    Initialize CORS headers for the Flask app.
    This should be called after creating the Flask app.
    """
    @app.after_request
    def add_cors_headers(response):
        if request.method == 'OPTIONS':
            response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return response

def handle_notes_options():
    """Handle CORS preflight for /api/notes endpoint"""
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

def handle_note_options(note_id):
    """Handle CORS preflight for /api/notes/<id> endpoint"""
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, DELETE, OPTIONS'
    return response
