# Notes API Documentation

This document provides detailed information about the Notes API, including available endpoints, request/response formats, and examples.

## Base URL
All API endpoints are prefixed with `/api`.

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message here"
}
```

## Notes Endpoints

### Get All Notes

- **URL**: `/notes`
- **Method**: `GET`
- **Response**: List of all notes
- **Status Codes**:
  - `200`: Success
  - `500`: Server error

**Example Request**:
```http
GET /api/notes
```

**Example Response**:
```json
[
  {
    "id": 1,
    "title": "Welcome to Notes App",
    "description": "This is your first note. Edit or delete it to get started!",
    "category_id": 1,
    "updated_on": "2025-07-25T18:00:00Z"
  }
]
```

### Get a Single Note

- **URL**: `/notes/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id` (required): The ID of the note
- **Status Codes**:
  - `200`: Success
  - `404`: Note not found
  - `500`: Server error

**Example Request**:
```http
GET /api/notes/1
```

**Example Response**:
```json
{
  "id": 1,
  "title": "Welcome to Notes App",
  "description": "This is your first note. Edit or delete it to get started!",
  "category_id": 1,
  "updated_on": "2025-07-25T18:00:00Z"
}
```

### Create a New Note

- **URL**: `/notes`
- **Method**: `POST`
- **Request Body**:
  - `title` (required): The title of the note
  - `description` (required): The content of the note
  - `category_id` (optional, default: 1): The ID of the category
- **Status Codes**:
  - `201`: Note created successfully
  - `400`: Invalid input
  - `500`: Server error

**Example Request**:
```http
POST /api/notes
Content-Type: application/json

{
  "title": "Shopping List",
  "description": "Milk, Eggs, Bread",
  "category_id": 1
}
```

**Example Response**:
```json
{
  "id": 2,
  "title": "Shopping List",
  "description": "Milk, Eggs, Bread",
  "category_id": 1,
  "updated_on": "2025-07-25T18:05:00Z"
}
```

### Update a Note

- **URL**: `/notes/:id`
- **Method**: `PUT`
- **URL Parameters**:
  - `id` (required): The ID of the note to update
- **Request Body**:
  - `title` (optional): New title
  - `description` (optional): New description
  - `category_id` (optional): New category ID
- **Status Codes**:
  - `200`: Note updated successfully
  - `404`: Note not found
  - `500`: Server error

**Example Request**:
```http
PUT /api/notes/2
Content-Type: application/json

{
  "title": "Updated Shopping List",
  "description": "Milk, Eggs, Bread, Butter"
}
```

**Example Response**:
```json
{
  "id": 2,
  "title": "Updated Shopping List",
  "description": "Milk, Eggs, Bread, Butter",
  "category_id": 1,
  "updated_on": "2025-07-25T18:10:00Z"
}
```

### Delete a Note

- **URL**: `/notes/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id` (required): The ID of the note to delete
- **Status Codes**:
  - `200`: Note deleted successfully
  - `404`: Note not found
  - `500`: Server error

**Example Request**:
```http
DELETE /api/notes/2
```

**Example Response**:
```json
{
  "message": "Note deleted successfully"
}
```

## Categories Endpoints

### Get All Categories

- **URL**: `/categories`
- **Method**: `GET`
- **Response**: List of all categories
- **Status Codes**:
  - `200`: Success
  - `500`: Server error

**Example Request**:
```http
GET /api/categories
```

**Example Response**:
```json
[
  {
    "id": 1,
    "name": "Misc",
    "color": "#673ab7"
  },
  {
    "id": 2,
    "name": "Work",
    "color": "#2196f3"
  }
]
```

### Create a New Category

- **URL**: `/categories`
- **Method**: `POST`
- **Request Body**:
  - `name` (required): The name of the category
  - `color` (required): The color code (hex format)
- **Status Codes**:
  - `201`: Category created successfully
  - `400`: Invalid input
  - `500`: Server error

**Example Request**:
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Personal",
  "color": "#4caf50"
}
```

**Example Response**:
```json
{
  "id": 3,
  "name": "Personal",
  "color": "#4caf50"
}
```

### Delete a Category

- **URL**: `/categories/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id` (required): The ID of the category to delete
- **Status Codes**:
  - `200`: Category deleted successfully
  - `400`: Cannot delete category with associated notes
  - `404`: Category not found
  - `500`: Server error

**Example Request**:
```http
DELETE /api/categories/3
```

**Example Response**:
```json
{
  "message": "Category deleted successfully"
}
```
## Running the API

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.flaskenv`

3. Run the development server:
   ```bash
   flask run
   ```

The API will be available at `http://127.0.0.1:5000/api`
