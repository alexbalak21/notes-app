from flask import Blueprint, jsonify, request
from sqlalchemy.orm import scoped_session
from model.Category import Category
from model.Note import Note

# Create a Blueprint for category routes
category_bp = Blueprint('category', __name__)

def init_category_controller(app, db_session):
    """Initialize the category controller with the app and database session"""
    global Session
    Session = db_session
    app.register_blueprint(category_bp, url_prefix='/api/categories')

# Get all categories
@category_bp.route('', methods=['GET'])
def get_categories():
    session = Session()
    try:
        categories = session.query(Category).all()
        return jsonify([category.to_dict() for category in categories])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Get a single category by ID
@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    session = Session()
    try:
        category = session.query(Category).get(category_id)
        if category:
            return jsonify(category.to_dict())
        else:
            return jsonify({"error": "Category not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Create a new category
@category_bp.route('', methods=['POST'])
def add_category():
    session = Session()
    try:
        data = request.get_json()
        
        # Validate required fields
        name = data.get('name', '').strip()
        color = data.get('color', '').strip()
        
        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not color:
            return jsonify({"error": "Color is required"}), 400
            
        new_category = Category(
            name=name,
            color=color
        )
        session.add(new_category)
        session.commit()
        return jsonify(new_category.to_dict()), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Update an existing category
@category_bp.route('/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    session = Session()
    try:
        category = session.query(Category).get(category_id)
        if category:
            data = request.get_json()
            if 'name' in data:
                category.name = data['name'].strip()
            if 'color' in data:
                category.color = data['color'].strip()
            
            if not category.name:
                return jsonify({"error": "Name cannot be empty"}), 400
                
            session.commit()
            return jsonify(category.to_dict())
        else:
            return jsonify({"error": "Category not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Delete a category
@category_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    session = Session()
    try:
        data = request.get_json() or {}
        target_category_id = data.get('targetCategoryId')
        
        category = session.query(Category).get(category_id)
        if not category:
            return jsonify({"error": "Category not found"}), 404
            
        # Check if the category is in use by counting associated notes
        note_count = session.query(Note).filter(Note.category_id == category_id).count()
        
        if note_count > 0:
            if not target_category_id:
                # Return note count to trigger the reassignment modal
                return jsonify({
                    "error": "Category has associated notes",
                    "noteCount": note_count
                }), 400
            else:
                # Validate target category exists and is different
                if target_category_id == category_id:
                    return jsonify({"error": "Cannot move notes to the same category"}), 400
                    
                target_category = session.query(Category).get(target_category_id)
                if not target_category:
                    return jsonify({"error": "Target category not found"}), 400
                
                # Reassign all notes to the target category
                session.query(Note).filter(Note.category_id == category_id).update(
                    {Note.category_id: target_category_id},
                    synchronize_session=False
                )
        
        # Delete the category
        session.delete(category)
        session.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
        
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
