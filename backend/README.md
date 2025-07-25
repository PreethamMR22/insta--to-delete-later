# Instagram Clone - Backend

This is the backend for the Instagram Clone application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- JWT-based authentication
- User profiles
- Follow/Unfollow users
- Create, read, update, and delete posts
- Like/Unlike posts
- Comment on posts
- File uploads for profile pictures and post images
- Pagination, filtering, and sorting

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd instagram-clone/backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example` and update with your configuration

4. Start the development server
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# File Upload
MAX_FILE_UPLOAD=1000000
FILE_UPLOAD_PATH=./public/uploads
```

## API Documentation

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user / clear cookie
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

### Users

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/follow/:id` - Follow a user
- `PUT /api/v1/users/unfollow/:id` - Unfollow a user
- `GET /api/v1/users/followers/:id` - Get user's followers
- `GET /api/v1/users/following/:id` - Get users that the user is following
- `PUT /api/v1/users/updatephoto` - Update user photo
- `DELETE /api/v1/users/deactivate` - Deactivate user account
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Posts

- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/feed` - Get posts from followed users
- `GET /api/v1/posts/:id` - Get single post
- `POST /api/v1/posts` - Create new post
- `DELETE /api/v1/posts/:id` - Delete post
- `PUT /api/v1/posts/like/:id` - Like a post
- `PUT /api/v1/posts/unlike/:id` - Unlike a post
- `POST /api/v1/posts/comment/:id` - Add comment to a post
- `DELETE /api/v1/posts/comment/:id/:comment_id` - Delete comment

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of an API request.

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Deployment

1. Set `NODE_ENV` to `production`
2. Update the `MONGODB_URI` to your production database
3. Set up a process manager like PM2 to keep the application running
4. Set up a reverse proxy like Nginx
5. Configure SSL/TLS

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
