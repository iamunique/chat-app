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

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/chat-app.git
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

- **Login User**
  - `POST /api/auth/login`

- **Logout User**
  - `POST /api/auth/logout`

### User Management

- **Create User**
  - `POST /api/users`
  - Headers: `Authorization: Bearer <adminToken>`

- **Edit User**
  - `PUT /api/users/:id`
  - Headers: `Authorization: Bearer <adminToken>`

- **Get Users**
  - `GET /api/users`
  - Headers: `Authorization: Bearer <adminToken>`

### Group Management

- **Create Group**
  - `POST /api/groups`
  - Headers: `Authorization: Bearer <userToken>`

- **Delete Group**
  - `DELETE /api/groups/:id`
  - Headers: `Authorization: Bearer <userToken>`

- **Search Groups**
  - `GET /api/groups`
  - Headers: `Authorization: Bearer <userToken>`

- **Add Member**
  - `POST /api/groups/add-member`
  - Headers: `Authorization: Bearer <userToken>`

### Messaging

- **Send Message**
  - `POST /api/groups/send-message`
  - Headers: `Authorization: Bearer <userToken>`

- **Like Message**
  - `POST /api/groups/like-message/:id`
  - Headers: `Authorization: Bearer <userToken>`

## Validation

This project uses `express-validator` for request validation. All error messages are combined into a single string separated by newline characters.

## Testing

This project uses Jest and Supertest for testing.

- To run the tests:
    ```bash
    npm test
    ```

## Postman Collection

A Postman collection is available to test the API endpoints. You can import the collection using the link below:

[Download Postman Collection](./chat_app_postman_collection.json)

---

Developed by Sanket Kolte.
