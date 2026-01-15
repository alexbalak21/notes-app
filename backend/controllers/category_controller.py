from flask import Blueprint, request, jsonify
from models.category import Category
from repositories.category_repository import CategoryRepository
from sqlalchemy.exc import SQLAlchemyError

category_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


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


# DELETE CATEGORY
@category_bp.delete("/<int:category_id>")
def delete_category(category_id):
    category = CategoryRepository.get_by_id(category_id)

    if not category:
        return jsonify({"error": "Category not found"}), 404

    try:
        CategoryRepository.delete(category)
        return jsonify({"message": "Category deleted successfully"}), 200

    except SQLAlchemyError as e:
        # MySQL trigger errors appear here
        error_msg = str(e.orig)

        return jsonify({"error": error_msg}), 400
