from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model import Base
from model.category import Category
from model.note import Note
from demo_data import DEMO_CATEGORIES, DEMO_NOTES

engine = create_engine('sqlite:///notes.db', echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Add Categories
for cat in DEMO_CATEGORIES:
    category = Category(name=cat["name"], color=cat["color"])
    session.add(category)

session.commit()

# Fetch inserted categories to map name -> id
categories_map = {c.name: c.id for c in session.query(Category).all()}

# Add Notes
for note_data in DEMO_NOTES:
    note = Note(
        title=note_data["title"],
        description=note_data["description"],
        category_id=note_data["category_id"]
    )
    session.add(note)

session.commit()
session.close()

print("✅ Demo data seeded successfully!")
