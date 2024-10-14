### React Login Backend
This is a backend for a simple login system using Node.js, Express, MySQL, JWT for authentication, and bcrypt for password hashing. The server handles user registration, login, and token-protected routes.

### Prerequisites
Make sure you have the following installed:

Node.js: Download and install Node.js
MySQL: Download and install MySQL
Postman (optional, for API testing): Download Postman


### Setup
1. Clone the repository
    code:
    git clone <repository-url>
    cd <project-directory>

2. Install dependencies
    In the project directory, run:
    npm install


3. MySQL Setup
Create a new MySQL database and table. You can do this by logging into MySQL and running the following SQL commands:

        CREATE DATABASE react_login;

        USE react_login;

        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255) UNIQUE
        );

4. Configure environment variables
Create a .env file in the root of the project with the following content:


            DB_HOST=localhost
            DB_USER=root
            DB_PASS=your_mysql_password
            DB_NAME=react_login
            JWT_SECRET=your_secret_key

*Replace your_mysql_password with your actual MySQL root password.
*Replace your_secret_key with a strong secret key for JWT.


5. Run the application
To start the server, run:

        npm start
*The server will be running on http://localhost:5000.

### API Endpoints
* Register a user:

POST /register
Request Body: { "username": "your_username", "password": "your_password" }
Response: { "message": "User registered successfully!" }
Login a user:

POST /login
Request Body: { "username": "your_username", "password": "your_password" }
Response: { "token": "your_jwt_token" }
Protected route:

GET /protected
Authorization: Bearer Token (use the JWT token from login)
Response: { "message": "Protected route accessed!", "userId": your_user_id }
Logout a user:

POST /logout
Response: { "message": "Logged out!" }



### Testing the API
* You can use Postman or cURL to test the API. Here’s an example using Postman:

1. Register a user:
        POST to http://localhost:5000/register with a JSON body.

2. Login a user:
        POST to http://localhost:5000/login with the same credentials to get a token.

3. Access protected route:
GET http://localhost:5000/protected with the token added in the Authorization header.

### License
This project is licensed under the MIT License.
