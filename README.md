# 👟 Shoe Shop Backend API

A production-ready RESTful backend API for a modern shoe shop e-commerce platform.

The application provides secure authentication, role-based authorization, product and size management, shopping cart functionality, order processing, admin order management, request validation, centralized error handling, and interactive Swagger API documentation.

---

## 📌 Project Overview

The Shoe Shop Backend is designed to support a complete e-commerce platform where customers can:

- Create an account and log in securely
- Browse available products
- View product details and available sizes
- Add products to their cart
- Manage cart items
- Place orders
- View their order history
- Track order status

Administrators can:

- Create products
- Update products
- Soft-delete products
- View all customer orders
- Manage customer orders
- Update order statuses

The API follows a RESTful architecture and uses PostgreSQL with Prisma ORM for reliable and scalable data management.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Customer and Admin roles
- Protected routes
- Admin-only routes

### 👟 Product Management

- Create products
- Get all active products
- Get product by ID
- Update product information
- Soft delete products
- Product size management
- Size-based inventory tracking

### 🛒 Shopping Cart

- Add products to cart
- Select product size
- Manage quantity
- Validate available stock
- Remove cart items
- Prevent adding unavailable products

### 📦 Order Management

- Create orders from cart items
- Automatically calculate order totals
- Validate product availability
- Validate size-specific stock
- Reduce stock after successful order
- Clear cart after successful checkout
- View customer orders
- View individual order details
- Prevent orders when stock is insufficient

### 👨‍💼 Admin Management

- Admin-only product management
- View all customer orders
- Update order status
- Role-based admin authorization

### 🛡️ Validation & Error Handling

- Request validation using Zod
- Product validation
- Price validation
- Stock validation
- Centralized error handling
- Proper HTTP status codes
- Authentication error handling
- Authorization error handling

### 📚 API Documentation

- OpenAPI 3.0
- Interactive Swagger UI
- JWT authentication support
- Documented API endpoints
- Request and response documentation

---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe development |

## Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database |
| Prisma ORM | Database ORM |
| Neon PostgreSQL | Cloud PostgreSQL database |

## Authentication & Security

| Technology | Purpose |
|------------|---------|
| JWT | Authentication |
| bcrypt | Password hashing |
| Role-based Middleware | Authorization |

## Validation & Documentation

| Technology | Purpose |
|------------|---------|
| Zod | Request validation |
| Swagger / OpenAPI | API documentation |

## Development Tools

- VS Code
- Git
- GitHub
- Thunder Client
- Prisma CLI

---

# 🏗️ Architecture

The backend follows a modular REST API architecture.

```text
Client
  │
  ▼
Express Server
  │
  ├── Authentication Middleware
  │
  ├── Admin Middleware
  │
  ├── Validation
  │
  ├── Routes
  │
  ├── Prisma ORM
  │
  ▼
PostgreSQL Database

# Request Flow

Client Request
      │
      ▼
Authentication
      │
      ▼
Authorization
      │
      ▼
Validation
      │
      ▼
Route Handler
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
      │
      ▼
Response

# 📁 Project Structure

shoe-shop-backend/
│
├── middleware/
│   ├── auth.ts
│   ├── admin.ts
│   └── error.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── adminOrders.ts
│   │
│   ├── validations/
│   │   └── product.validation.ts
│   │
│   ├── prisma.ts
│   ├── swagger.ts
│   └── ...
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

# 🚀 Getting Started

1. Clone the Repository
git clone https://github.com/Mdnayem097/shoe-shop-backend

2. Navigate to the Project
cd shoe-shop-backend

3. Install Dependencies
npm install

# 🔐 Environment Variables

DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5000

# 🗄️ Database Setup

npx prisma generate
npx prisma migrate dev
npx prisma studio

# ▶️ Running the Application

npm run dev
http://localhost:5000

# 📚 API Documentation

http://localhost:5000/api-docs

# 🛡️ Security

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Role-based authorization
- Admin-only product management
- Admin-only order management
- Input validation using Zod
- Environment variables for sensitive credentials
- Soft deletion for products
- Stock validation during cart and checkout operations

# 👨‍💻 Author

Md Nayem

Full Stack Developer focused on building modern web applications using:

- JavaScript
- TypeScript
- React.js
- Next.js
- Node.js
- Express.js
- PostgreSQL

## Connect With Me

- GitHub: https://github.com/Mdnayem097
- LinkedIn: https://www.linkedin.com/in/md-nayem-swe
- Portfolio: https://md-nayem-portfolio.vercel.app