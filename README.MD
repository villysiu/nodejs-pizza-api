# Pizza App
Full-Stack  Application with Role-Based Access Control

A pizza ordering platform where users can fully customize pizzas (size, ingredients, quantities) and securely place orders.

The application implements JWT authentication, role-based authorization, and a clean separation between frontend and backend services.

## API Documentation

`http://localhost:3000/api-docs`

`render.com`

## Architecture Overview

This project follows a separated client-server architecture:

Frontend – UI & user interaction

Backend – REST API & business logic

Database – Persistent storage

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Token
- Swagger

### Frontend
- React
- Vite
- React Router Dom
- React Bootstrap

## Features
### Authentication & Authorization

- User Registration & Login
- Password hashing
- JWT-based authentication
- Protected API routes
- Role-Based Access Control (RBAC)
  - ADMIN
  - USER
- Middleware validates 
  - JWT token
  - User role permissions
- Error handling

### Roles

#### User

- Browse pizza menu
- Customize menuitem with ingredient and size
- Add to cart
- Place orders
- View order history
- Change username and password

#### Admin
- Create, update & delete menuitem (ie. pizza)
- Create, update & delete size
- Create, update & delete ingredient 
- View all users
- Update user's role
- Delete user


### Project Structure
```
nodejs-pizza-api/  # Express API         
├── controllers/
├── db/
├── errors/
├── middleware/
├── models/
├── routes/
├── seed.js  # optional
└── app.js
└── README.md
└── swagger.yaml
```

### Local Development Setup
1️⃣ Clone Repository

```
git clone https://github.com/your-username/pizza-ordering-app.git

cd pizza-ordering-app 
```
🗄 Backend Setup
Install Dependencies
```
cd server
npm install
```
Create Environment File

Inside /server, create a .env file:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret

⚠️ .env is not committed to version control.

Seed Database

The project includes a seeding script to preload pizza data.

npm run seed

This will:

Clear existing pizza data

Insert sample menu items

Start Backend
npm start

Backend runs on:

