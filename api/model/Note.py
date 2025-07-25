from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from model.Category import Category
from model import Base

from datetime import datetime
from sqlalchemy import DateTime

class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey('categories.id'))
    updated_on = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationship with Category
    category = relationship('Category', back_populates='notes')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,    
            'description': self.description,
            'category_id': self.category_id,
            'updated_on': self.updated_on.isoformat() + 'Z'
        }
