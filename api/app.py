import os
from datetime import datetime
from flask import Flask, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from model import Base
from controller.note_controller import init_note_controller
from controller.category_controller import init_category_controller
from model.Category import Category
from model.Note import Note

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

# Initialize controllers
init_note_controller(app, Session)
init_category_controller(app, Session)


# Import demo data
from demo_data import DEMO_CATEGORIES, DEMO_NOTES

def seed_demo_data():
    """Seed the database with demo data if it's empty"""
    session = Session()
    try:
        # Check if we need to seed data
        category_count = session.query(Category).count()
        note_count = session.query(Note).count()
        
        if category_count == 0 and note_count == 0:
            print("\n Starting database seeding...")
            
            # Seed categories
            print("Seeding categories...")
            for cat_data in DEMO_CATEGORIES:
                category = Category(name=cat_data["name"], color=cat_data["color"])
                session.add(category)
            session.commit()
            print(f"Seeded {len(DEMO_CATEGORIES)} categories")
            
            # Seed notes
            print("Seeding notes...")
            for note_data in DEMO_NOTES:
                note = Note(
                    title=note_data["title"],
                    description=note_data["description"],
                    category_id=note_data["category_id"]
                )
                session.add(note)
            session.commit()
            print(f"Seeded {len(DEMO_NOTES)} notes")
            print("Database seeding completed!\n")
            
        else:
            print(f"\n Database already contains {category_count} categories and {note_count} notes")
            print("   No seeding required.\n")
            
    except Exception as e:
        session.rollback()
        print(f"Error seeding data: {e}")
        raise
    finally:
        session.close()

# Create database tables and seed data
with app.app_context():
    # This will create tables if they don't exist
    Base.metadata.create_all(engine)
    
    # Seed demo data if the database is empty
    seed_demo_data()

import atexit

def drop_tables():
    print("\nDropping all database tables...")
    Base.metadata.drop_all(engine)

@app.teardown_appcontext
def shutdown_session(exception=None):
    Session.remove()

# Register the drop_tables function to run on application exit
atexit.register(drop_tables)
