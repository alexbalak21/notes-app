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

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', '3306')}/{os.getenv('MYSQL_DB')}"
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

# Create database tables
Base.metadata.create_all(engine)

# Create session factory
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

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

            # Create a default note
            if session.query(Note).count() == 0:
                note = Note(
                    title="Welcome to Notes App",
                    description="This is your first note. Edit or delete it to get started!",
                    category_id=category.id,
                    updated_at=datetime.utcnow()
                )
                session.add(note)
                session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error seeding data: {e}")
    finally:
        session.close()

# Create database tables and seed data
with app.app_context():
    seed_data()

@app.teardown_appcontext
def shutdown_session(exception=None):
    Session.remove()

@app.route('/notes', methods=['GET'])
def get_notes():
    session = Session()
    try:
        notes = session.query(Note).all()
        return jsonify([note.to_dict() for note in notes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
