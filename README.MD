# Pizza App
Full-Stack  Application with Role-Based Access Control

A pizza ordering platform where users can customize pizzas (size, ingredients, quantities) and securely place orders.

The application implements JWT authentication, role-based authorization, and a clean separation between frontend and backend services.

Users can customize pizzas (size, ingredients, quantities), manage carts, and securely place orders.

Admins can manage menu items, ingredients, sizes, and users.
## Live Demo 

Frontend (User Interface):

`https://villysiu.github.io/pizza-react/`

API Server:

`https://pizza-api-wp8t.onrender.com`

API Documentation:

`https://pizza-api-wp8t.onrender.com/api-docs`

## Repositories
API: 

`https://github.com/villysiu/pizza-ordering-app.git`

Frontend: 

`https://github.com/villysiu/pizza-react`

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
  - Protected routes
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
- Delete user and all related order, order details and carts.


### Project Structure
```
nodejs-pizza-api/  # Express API         
├── controllers/
├── db/
├── errors/
├── middleware/
├── models/
├── routes/

└── app.js
└── README.md
└── swagger.yaml
```



