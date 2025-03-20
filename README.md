# MinionDoc API 🦸♂️

A lightweight RESTful API for dynamic document storage using Node.js and Express. Stores data in a local JSON file with dynamic entity/collection support.

## Features

- 🚀 Dynamic entity creation through URL paths
- 📁 Local JSON file storage (no database required)
- 🔑 Automatic UUID generation for entries
- 🔄 Full CRUD operations (Create, Read, Update, Delete)
- 🛡️ Error handling and validation

## Installation

1. Clone the repository
```bash
git clone [your-repo-url]
```
2. Install dependencies
```bash
npm install
```
3. Start the server
```bash
npm start
```
For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/:entity`         | Get all items in a collection        |
| GET    | `/api/:entity/:id`     | Get single item by ID                |
| POST   | `/api/:entity`         | Create new item in collection        |
| PUT    | `/api/:entity/:id`     | Update existing item by ID           |
| DELETE | `/api/:entity/:id`     | Delete item by ID                    |

## Usage Examples

### Create New Collection Item
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "task": "Learn Node.js",
  "completed": false
}' http://localhost:3000/api/todos
```
Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "task": "Learn Node.js",
  "completed": false
}
```

### Get All Items in Collection
```bash
curl http://localhost:3000/api/todos
```
Response:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "task": "Learn Node.js",
    "completed": false
  }
]
```

### Get Single Item
```bash
curl http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

### Update Item
```bash
curl -X PUT -H "Content-Type: application/json" -d '{
  "completed": true
}' http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

### Delete Item
```bash
curl -X DELETE http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

## Data Storage Structure

The API automatically creates a `data.json` file with this structure:
```json
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "task": "Learn Node.js",
      "completed": false
    }
  ],
  "users": [
    {
      "id": "d94a1d70-ef58-4ac8-9e15-93646de5dd98",
      "name": "Alice Smith",
      "email": "alice@example.com"
    }
  ]
}
```

## Error Handling

Common error responses:

- `404 Not Found`:
  ```json
  { "error": "Item not found" }
  ```
- `500 Internal Server Error`:
  ```json
  { "error": "Internal server error" }
  ```

## Testing with Postman

1. Import the following collection into Postman:

```json
{
  "info": {
    "name": "MinionDoc API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Item",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"example\": \"data\"\n}"
        },
        "url": "http://localhost:3000/api/{{collection}}"
      }
    },
    {
      "name": "Get All Items",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/{{collection}}"
      }
    }
  ]
}
```

## Notes

- Data persists as long as the `data.json` file exists
- Collections are automatically created on first insert
- All data is stored in memory while server is running
- IDs are immutable once created 