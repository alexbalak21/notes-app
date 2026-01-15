from flask import Blueprint, request, jsonify
from models.category import Category
from repositories.category_repository import CategoryRepository
from extensions import db
from cors import handle_categories_options

category_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


# OPTIONS (CORS preflight)
@category_bp.route("", methods=["OPTIONS"])
def categories_options():
    return handle_categories_options()


# CREATE CATEGORY
@category_bp.route("", methods=["POST"])
def create_category():
    data = request.get_json()

    # Validate required fields
    if not data or "name" not in data or "color" not in data:
        return jsonify({"error": "Name and color are required"}), 400

    # Check if category already exists
    if CategoryRepository.get_by_name(data["name"]):
        return jsonify({"error": "A category with this name already exists"}), 400

    # Create new category
    new_category = Category(
        name=data["name"],
        color=data["color"]
    )

    CategoryRepository.create(new_category)
    return jsonify(new_category.to_dict()), 201


# GET ALL CATEGORIES
@category_bp.route("", methods=["GET"])
def get_categories():
    categories = CategoryRepository.get_all()
    return jsonify([c.to_dict() for c in categories])
