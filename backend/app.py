from flask import Flask
from dotenv import load_dotenv
from extensions import db
from controllers.note_controller import note_bp
from controllers.category_controller import category_bp
from controllers.index_controller import index_bp
from cors import init_cors
import os

load_dotenv()


def create_app():
    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="templates/assets",
        static_url_path="/assets"
    )

    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}"
        f"@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', '3306')}/{os.getenv('MYSQL_DB')}"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    init_cors(app)

    app.register_blueprint(note_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(index_bp)

    return app


app = create_app()
