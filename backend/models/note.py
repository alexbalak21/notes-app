from datetime import datetime
from extensions import db
from models.category import Category


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Integer, db.ForeignKey(
        'category.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False, default='')
    description = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description or "",
            "category_id": self.category,
            "updated_on": self.updated_at.isoformat() + "Z" if self.updated_at else None
        }
