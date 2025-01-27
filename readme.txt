# URL Shortener Project

## Overview
This project is a URL shortener service that allows users to shorten long URLs and redirect to the original URLs using the shortened aliases. It includes user authentication via Google OAuth, session management, and logging of URL access.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/url-shortener.git
    cd url-shortener
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the following variables:
    ```env
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    SESSION_SECRET=your-strong-secret-key
    MONGO_URL=mongodb://localhost:27017/session-db
    REDIS_URL=redis://localhost:6379
    IS_MAINTENANCES=false
    ```

4. Start the application:
    ```bash
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Project Structure


Sure, here is a sample README.md file for your project. This documentation includes an overview of the project, setup instructions, and descriptions of the main components and routes.

url-shortener/ ├── apps/ │ ├── controller/ │ │ ├── authController.js │ │ ├── urlShorterController.js │ │ └── userController.js │ ├── db/ │ │ └── dbConfig/ │ │ └── index.js │ ├── middleware/ │ │ ├── authSession.js │ │ └── responseHandler.js │ ├── models/ │ │ ├── urlSchema.js │ │ └── userSchema.js │ ├── router/ │ │ ├── index.js │ │ └── v1/ │ │ └── userRoutes.js │ ├── services/ │ │ └── urlService.js │ ├── utils/ │ │ └── generateUniqueId.js │ └── views/ │ └── login.ejs ├── .env ├── index.js ├── package.json └── README.md


## Main Components

### Controllers
- **authController.js**: Handles user authentication via Google OAuth and session management.
- **urlShorterController.js**: Manages URL shortening and redirection.
- **userController.js**: Provides user profile information.

### Middleware
- **authSession.js**: Middleware to check if the user session is valid.
- **responseHandler.js**: Custom response handler middleware.

### Models
- **urlSchema.js**: Mongoose schema for storing URL information.
- **userSchema.js**: Mongoose schema for storing user information.

### Routes
- **index.js**: Main router file that mounts other routers.
- **userRoutes.js**: Routes related to user operations.

### Services
- **urlService.js**: Contains service methods for URL operations.

### Utilities
- **generateUniqueId.js**: Utility function to generate unique IDs.

## API Endpoints

### Authentication
- **GET /google**: Initiates Google OAuth authentication.
- **GET /google/callback**: Handles Google OAuth callback and sets user session.

### User
- **GET /user/me**: Retrieves the authenticated user's profile information.

### URL Shortening
- **POST /shorten**: Creates a shortened URL.
- **GET /:alias**: Redirects to the original URL based on the alias.

## Logging
- Logs URL access details such as user agent, IP address, and session ID.

## Session Management
- Uses `express-session` with `connect-mongo` for session storage in MongoDB.

## Error Handling
- Custom error handling middleware to handle and respond to errors gracefully.

## License
This project is licensed under the MIT License.
