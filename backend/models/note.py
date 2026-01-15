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
        category_obj = Category.query.get(self.category)
        category_data = category_obj.to_dict() if category_obj else {
            "id": 1,
            "name": "Misc",
            "color": "#9e9e9e"
        }

        return {
            "id": self.id,
            "title": self.title,
            "description": self.description or "",
            "category": category_data["name"],
            "category_id": category_data["id"],
            "category_color": category_data["color"],
            "updated_at": self.updated_at.isoformat() + "Z"
        }
