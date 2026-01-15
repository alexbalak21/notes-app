from flask import Blueprint, send_from_directory, render_template

index_bp = Blueprint("index", __name__)


@index_bp.route("/", defaults={"path": ""})
@index_bp.route("/<path:path>")
def serve_react(path):
    # Serve static assets from templates/
    if path and (path.startswith("assets") or "." in path):
        return send_from_directory("templates", path)

    # Otherwise return index.html
    return render_template("index.html")
