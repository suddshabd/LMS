# PIB BITS LMS Backend

Express.js backend for PIB BITS Learning Management System

## Features

- **Course Management**: Create, read, update, delete courses
- **User Management**: User profiles, role-based access
- **Authentication**: Clerk integration for secure authentication
- **Search & Filter**: Find courses by category, search term, or sorting
- **RESTful API**: Clean API structure for frontend integration

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pib-bits
JWT_SECRET=your_jwt_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=http://localhost:5175
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses (with filters: category, search, sort)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/author/:authorId` - Get courses by author

### Users
- `GET /api/users/:clerkId` - Get user by Clerk ID
- `POST /api/users/sync` - Sync user with Clerk
- `PUT /api/users/:clerkId` - Update user profile
- `GET /api/users/:clerkId/purchased-courses` - Get purchased courses
- `GET /api/users/:clerkId/created-courses` - Get created courses

### Auth
- `GET /api/auth/health` - Health check
- `POST /api/auth/webhook` - Clerk webhook handler

## Database Setup

Make sure MongoDB is running:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Default Port

Server runs on `http://localhost:5000`

## Frontend Integration

The backend is configured to accept requests from `http://localhost:5175` (frontend URL). Update `FRONTEND_URL` in `.env` if your frontend runs on a different port.
