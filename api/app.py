from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy

application = Flask(__name__)
app = application

@app.route("/")
def hello_world():
    return jsonify({"message": "Hello, World!"})