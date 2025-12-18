# Note-Taking REST API

A secure, scalable REST API for a note-taking application built with **TypeScript**, **Node.js**, **Express**, and **MongoDB**. This project satisfies the requirements for the Swipe Team technical assessment.



## Features

- **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.
- **CRUD Operations:** Full Create, Read, Update, and Delete capabilities for notes.
- **Data Privacy:** Users can only access, edit, or delete notes they personally created.
- **Query Filtering:** Search notes by partial title matches or filter by creation date.
- **Input Validation:** Robust request body validation using Joi.
- **Type Safety:** Built entirely with TypeScript for reliable code.

## 1. Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Validation:** Joi
- **Auth:** JSON Web Tokens (JWT) & BcryptJS

## 2. Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## 3. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/habidoyetech/note-taking-api.git
   cd note-taking-app

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file in the root directory:**
    ```env
    PORT=3000
    DB_CONNECT=your_mongodb_connection_string
    JWT_SECRET=your_random_secret_string
    ```

4. **Build the TypeScript code:**
    ```bash
    npm run build
    ```

5. **Start the development server:**
    ```bash
    npm run dev
    ```

## 4. API Endpoints

### Authentication

#### Register a new user
```http
POST /api/user/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Abidoye Abiodun"
}
```

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**: Returns a JWT token
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Notes

All note endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Create a note
```http
POST /api/notes
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

#### Get all notes
```http
GET /api/notes
Authorization: Bearer <token>
```

#### Get all notes by title and date created
```http
GET /api/notes?title=one&createdAt=2024-12-31
Authorization: Bearer <token>
```

#### Get a specific note
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Update a note
```http
PUT /api/notes/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete a note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

## Project Structure

```
.
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── noteController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   ├── models/
│   │   ├── user.ts
│   │   └── note.ts
│   ├── routes/
│   │   ├── authRoute.ts
│   │   └── noteRoute.ts
│   ├── utils/
│   │   └── validation.ts
│   └── app.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Deployment on Render.com

1. Create a new account on [Render.com](https://render.com)

2. Create a new Web Service and connect your GitHub repository

3. Configure the service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. Add environment variables in Render dashboard:
   - `DB_CONNECT` - Your MongoDB connection string (use MongoDB Atlas)
   - `JWT_SECRET` - Your JWT secret key
   - `PORT` - PORT


5. Deploy! Render will automatically deploy your application.

### MongoDB Atlas Setup

For production deployment, use MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add a database user
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to Render's environment variables

## Security Considerations

- Passwords are hashed using bcrypt before storing
- JWT tokens are used for stateless authentication
- Environment variables are used for sensitive configuration
- Input validation is implemented on all endpoints
- Users can only access their own notes

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## License

MIT

## Author

Your Name

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discu