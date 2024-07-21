# Chat App API

This is a backend API for a Chat Application built with Node.js, Express, and MongoDB. It provides functionalities for user authentication, group management, and messaging.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Group Management](#group-management)
  - [Messaging](#messaging)
- [Validation](#validation)
- [Testing](#testing)
- [Postman Collection](#postman-collection)
- [Error Handling](#error-handling)
- [Developed By](#developed-by)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iamunique/chat-app.git
   cd chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of your project and add the following variables:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Usage

- The API server will be running at `http://localhost:3000`.
- Use a tool like Postman to interact with the API endpoints.

## API Endpoints

### Authentication

- **Register User**

  - `POST /api/auth/register`
  - Description: Register a new admin user. This endpoint can only be used for the initial admin creation.
  - Body Parameters:
    - `username` (string): The username of the new admin.
    - `password` (string): The password of the new admin.
  - Possible Errors:
    - `400 Bad Request`: For Initial Admin Creation Only

- **Login User**

  - `POST /api/auth/login`
  - Description: Login an existing user.
  - Body Parameters:
    - `username` (string): The username of the user.
    - `password` (string): The password of the user.
  - Possible Errors:
    - `401 Unauthorized`: Invalid username or password.

- **Logout User**
  - `POST /api/auth/logout`
  - Description: Logout the current user.
  - Headers: `Authorization: Bearer <userToken>`

### User Management

- **Create User**

  - `POST /api/users`
  - Headers: `Authorization: Bearer <adminToken>`
  - Description: Create a new user. Only admins can create users.
  - Body Parameters:
    - `username` (string): The username of the new user.
    - `password` (string): The password of the new user.
    - `role` (string): The role of the new user (e.g., "admin", "user").
  - Possible Errors:
    - `409 Conflict`: Username already exists.

- **Edit User**

  - `PUT /api/users/:id`
  - Headers: `Authorization: Bearer <adminToken>`
  - Description: Edit an existing user. Only admins can edit users.
  - Body Parameters:
    - `username` (string): The new username of the user.
    - `role` (string): The new role of the user.
  - Possible Errors:
    - `404 Not Found`: User not found.
    - `409 Conflict`: Username already exists.

- **Get Users**
  - `GET /api/users`
  - Headers: `Authorization: Bearer <adminToken>`
  - Description: Get a list of all users. Only admins can access this endpoint.
  - Query Parameters:
    - `offset` (number): The number of users to skip (default: 0).
    - `limit` (number): The number of users to return (default: 10).

### Group Management

- **Create Group**

  - `POST /api/groups`
  - Headers: `Authorization: Bearer <userToken>`
  - Description: Create a new group. Only authenticated users can create a group.
  - Body Parameters:
    - `name` (string): The name of the group.
    - `members` (string[]): The initial list of members' IDs.

- **Delete Group**

  - `DELETE /api/groups/:id`
  - Headers: `Authorization: Bearer <userToken>`
  - Description: Delete a group by its ID. Only the admin of the group can delete it.
  - Possible Errors:
    - `404 Not Found`: Group not found.
    - `401 Unauthorized`: User is not the admin.

- **Search Groups**

  - `GET /api/groups`
  - Headers: `Authorization: Bearer <userToken>`
  - Description: Search for groups by name. The search is case-insensitive and returns the member count.
  - Query Parameters:
    - `name` (string): The name of the group to search for.

- **Add Member**
  - `POST /api/groups/add-member`
  - Headers: `Authorization: Bearer <userToken>`
  - Description: Add a member to a group by username. Only the admin of the group can add members, and the user to be added must not already be a member or the admin.
  - Body Parameters:
    - `groupId` (string): The ID of the group.
    - `userName` (string): The username of the user to add.
  - Possible Errors:
    - `404 Not Found`: Group or user not found.
    - `400 Bad Request`: User is already the admin or a member of the group.

### Messaging

- **Send Message**

  - `POST /api/groups/send-message`
  - Headers: `Authorization: Bearer <userToken>`
  - Description: Send a message to a group. Only a member of the group can send messages.
  - Body Parameters:
    - `groupId` (string): The ID of the group.
    - `senderId` (string): The ID of the sender.
    - `content` (string): The content of the message.
  - Possible Errors:
    - `404 Not Found`: Group not found.
    - `401 Unauthorized`: User is not a member of the group.

- **Like Message**
  - `POST /api/groups/like-message/:id`
  - Headers: `Authorization: Bearer <userToken>`
  - Description: Like a message by its ID.
  - Possible Errors:
    - `404 Not Found`: Message not found.

## Validation

This project uses `express-validator` for request validation. All error message details are combined into a single string.

## Testing

This project uses Jest and Supertest for testing.

- To run the tests:
  ```bash
  npm test
  ```

## Postman Collection

A Postman collection is available to test the API endpoints. You can import the collection using the link below:

[Download Postman Collection](./chat_app_postman_collection.json)

## Error Handling

Errors are handled using custom error classes and centralized error handling middleware. Proper HTTP status codes and structured error messages are returned for different error scenarios.

## Developed By

Developed by Sanket Kolte.
