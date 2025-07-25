import os
from datetime import datetime
from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from model import Base
from model.Note import Note
from model.Category import Category

# Initialize Flask app
app = Flask(__name__)

# Create a URL prefix for all routes
BASE_URL = '/api'

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', '3306')}/{os.getenv('MYSQL_DB')}"
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

# Create database tables
Base.metadata.create_all(engine)

# Create session factory
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

@app.route(f'{BASE_URL}/notes', methods=['GET'])
def get_notes():
    session = Session()
    try:
        notes = session.query(Note).all()
        return jsonify([note.to_dict() for note in notes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@app.route(f'{BASE_URL}/notes', methods=['POST'])
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




# Initialize one category and one note on startup
def seed_data():
    session = Session()
    try:
        # Check if any categories exist
        if session.query(Category).count() == 0:
            # Create a default category
            category = Category(name="Misc", color="#673ab7")
            session.add(category)
            session.commit()
            print("Category seeded successfully!")

            # Create a default note
            if session.query(Note).count() == 0:
                note = Note(
                    title="Welcome to Notes App",
                    description="This is your first note. Edit or delete it to get started!",
                    category_id=category.id,
                    updated_on=datetime.utcnow()
                )
                session.add(note)
                session.commit()
                print("Note seeded successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error seeding data: {e}")
    finally:
        session.close()

# Create database tables and seed data
with app.app_context():
    seed_data()

import atexit

def drop_tables():
    print("\nDropping all database tables...")
    Base.metadata.drop_all(engine)

@app.teardown_appcontext
def shutdown_session(exception=None):
    Session.remove()

# Register the drop_tables function to run on application exit
atexit.register(drop_tables)
