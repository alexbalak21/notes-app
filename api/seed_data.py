from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from model import Base
from model.Category import Category
from model.Note import Note
from demo_data import DEMO_CATEGORIES, DEMO_NOTES

# Database configuration
DB_USER = os.getenv('MYSQL_USER', 'root')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
DB_HOST = os.getenv('MYSQL_HOST', 'localhost')
DB_PORT = os.getenv('MYSQL_PORT', '3306')
DB_NAME = os.getenv('MYSQL_DB', 'notes_app')

# Create database engine
DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URI, echo=True)

# Create database tables
Base.metadata.create_all(engine)

# Create session
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Clear existing data
    print("Clearing existing data...")
    session.query(Note).delete()
    session.query(Category).delete()
    session.commit()
    
    print("Seeding categories...")
    # Add Categories
    for cat in DEMO_CATEGORIES:
        category = Category(name=cat["name"], color=cat["color"])
        session.add(category)
    
    session.commit()
    print(f"✅ Seeded {len(DEMO_CATEGORIES)} categories.")
    
    print("Seeding notes...")
    # Add Notes
    for note_data in DEMO_NOTES:
        note = Note(
            title=note_data["title"],
            description=note_data["description"],
            category_id=note_data["category_id"]
        )
        session.add(note)
    
    session.commit()
    print(f"✅ Seeded {len(DEMO_NOTES)} notes.")
    
except Exception as e:
    session.rollback()
    print(f"❌ Error seeding data: {e}")
    raise
    
finally:
    session.close()
    print("✅ Database seeding completed!")
