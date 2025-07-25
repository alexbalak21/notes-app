class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(7), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color
        }