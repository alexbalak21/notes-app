"""
Sample data for the Notes application.
This module contains sample notes and categories that can be used to populate the database.
"""
from datetime import datetime, timedelta

# Sample categories
SAMPLE_CATEGORIES = [
    {"name": "Misc", "color": "#9e9e9e"},        # Gray
    {"name": "Work", "color": "#2196f3"},        # Blue
    {"name": "Personal", "color": "#4caf50"},    # Green
    {"name": "Ideas", "color": "#9c27b0"},      # Purple
    {"name": "Shopping", "color": "#ff9800"},   # Orange
    {"name": "Important", "color": "#f44336"}   # Red
]

# Sample notes with timestamps
now = datetime.utcnow()

SAMPLE_NOTES = [
    {
        "title": "Welcome to Notes App",
        "description": "This is your first note. You can edit or delete it.",
        "category": "Misc",
        "created_at": now - timedelta(days=2)
    },
    {
        "title": "Project Ideas",
        "description": "Brainstorm ideas for the new project. Consider using React for the frontend.",
        "category": "Ideas",
        "created_at": now - timedelta(days=1, hours=5)
    },
    {
        "title": "Grocery List",
        "description": "- Milk\n- Eggs\n- Bread\n- Fruits",
        "category": "Shopping",
        "created_at": now - timedelta(days=1)
    },
    {
        "title": "Team Meeting Notes",
        "description": "Discussed project timeline and assigned tasks. Next meeting on Friday.",
        "category": "Work",
        "created_at": now - timedelta(hours=12)
    },
    {
        "title": "Personal Goals",
        "description": "1. Learn a new programming language\n2. Read 12 books this year\n3. Exercise 3x a week",
        "category": "Personal",
        "created_at": now - timedelta(hours=6)
    },
    {
        "title": "Important Deadlines",
        "description": "- Project submission: 2025-08-15\n- Team presentation: 2025-08-20\n- Code review: 2025-08-22",
        "category": "Important",
        "created_at": now - timedelta(hours=3)
    },
    {
        "title": "Book Recommendations",
        "description": "- Atomic Habits\n- Deep Work\n- The Pragmatic Programmer",
        "category": "Personal",
        "created_at": now - timedelta(hours=2)
    },
    {
        "title": "Code Refactoring",
        "description": "Need to refactor the authentication module and add error handling.",
        "category": "Work",
        "created_at": now - timedelta(hours=1)
    },
    {
        "title": "Weekend Plans",
        "description": "- Hiking on Saturday\n- Movie night\n- Meal prep for next week",
        "category": "Personal",
        "created_at": now - timedelta(minutes=30)
    },
    {
        "title": "Learning Resources",
        "description": "Check out:\n- freeCodeCamp\n- MDN Web Docs\n- Real Python",
        "category": "Ideas",
        "created_at": now
    }
]
