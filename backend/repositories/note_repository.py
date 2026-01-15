from models.note import Note
from extensions import db

class NoteRepository:

    @staticmethod
    def get_all():
        return Note.query.all()

    @staticmethod
    def get_by_id(note_id):
        return Note.query.get(note_id)

    @staticmethod
    def create(note):
        db.session.add(note)
        db.session.commit()
        return note

    @staticmethod
    def delete(note):
        db.session.delete(note)
        db.session.commit()

    @staticmethod
    def update():
        db.session.commit()
