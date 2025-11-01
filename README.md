# E-commerce Product Management API

A robust RESTful API built with TypeScript, Express.js, and MongoDB for managing e-commerce products and orders.

## 🚀 Features

- **🔐 User Authentication**: JWT-based authentication with secure password hashing
- **👤 User Profiles**: Complete user profile management with role-based access control
- **🛍️ Product Management**: Full CRUD operations for products
- **📦 Order Management**: Create and retrieve orders with automatic inventory updates
- **🔍 Search Functionality**: Search products by name, description, category, or tags
- **📊 Inventory Management**: Automatic inventory updates when orders are placed
- **✅ Data Validation**: Comprehensive validation using Zod
- **🛡️ Error Handling**: Graceful error handling with meaningful error messages
- **📘 TypeScript**: Fully typed codebase for better developer experience

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v5.0 or higher)

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ecommerce
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456
JWT_EXPIRE=7d
```

4. **Start MongoDB**

Make sure MongoDB is running on your system:

```bash
# For Windows (if MongoDB is installed as a service)
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication & User Management

For complete authentication documentation with examples, see [AUTHENTICATION.md](./AUTHENTICATION.md)

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile (🔐 Protected)
- `PUT /api/auth/profile` - Update user profile (🔐 Protected)
- `PUT /api/auth/change-password` - Change password (🔐 Protected)
- `POST /api/auth/logout` - Logout user (🔐 Protected)
- `GET /api/auth/users` - Get all users (🔐 Admin only)
- `DELETE /api/auth/users/:userId` - Delete user (🔐 Admin only)

### Product Management

#### 1. Create a New Product
- **URL**: `/api/products`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "iPhone 13",
  "description": "A sleek and powerful smartphone with cutting-edge features.",
  "price": 999,
  "category": "Electronics",
  "tags": ["smartphone", "Apple", "iOS"],
  "variants": [
    {
      "type": "Color",
      "value": "Midnight Blue"
    },
    {
      "type": "Storage Capacity",
      "value": "256GB"
    }
  ],
  "inventory": {
    "quantity": 50,
    "inStock": true
  }
}
```

#### 2. Get All Products
- **URL**: `/api/products`
- **Method**: `GET`

#### 3. Get Product by ID
- **URL**: `/api/products/:productId`
- **Method**: `GET`

#### 4. Update Product
- **URL**: `/api/products/:productId`
- **Method**: `PUT`
- **Body**: Same as Create Product

#### 5. Delete Product
- **URL**: `/api/products/:productId`
- **Method**: `DELETE`

#### 6. Search Products
- **URL**: `/api/products?searchTerm=iphone`
- **Method**: `GET`

### Order Management

#### 1. Create a New Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "level2@programming-hero.com",
  "productId": "5fd67e890b60c903cd8544a3",
  "price": 999,
  "quantity": 1
}
```

#### 2. Get All Orders
- **URL**: `/api/orders`
- **Method**: `GET`

#### 3. Get Orders by Email
- **URL**: `/api/orders?email=level2@programming-hero.com`
- **Method**: `GET`

## 🧪 Testing the API

You can test the API using tools like:
- Postman
- Thunder Client (VS Code Extension)
- cURL
- Insomnia

## 📁 Project Structure

```
ecommerce/
├── src/
│   ├── config/
│   │   ├── config.ts          # Environment configuration
│   │   └── database.ts        # MongoDB connection
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   └── order.controller.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   └── order.model.ts
│   ├── routes/
│   │   ├── product.routes.ts
│   │   └── order.routes.ts
│   ├── services/
│   │   ├── product.service.ts
│   │   └── order.service.ts
│   ├── validators/
│   │   └── validation.ts      # Zod validation schemas
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env.example
├── .eslintrc.json
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Technologies Used

- **TypeScript**: For type-safe code
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Zod**: Schema validation
- **ESLint**: Code linting

## 🌟 Key Features Implemented

### ✅ Product Management
- Create, read, update, and delete products
- Search products by multiple fields
- Comprehensive product data structure with variants and inventory

### ✅ Order Management
- Create new orders
- Retrieve all orders or filter by email
- Automatic inventory management

### ✅ Inventory Management (Bonus)
- Automatic inventory quantity reduction when orders are placed
- Auto-update `inStock` status based on quantity
- Validation to prevent orders when insufficient stock

### ✅ Validation
- Zod schema validation for all inputs
- Mongoose schema validation as secondary layer
- Comprehensive error messages

### ✅ Error Handling
- Graceful error handling throughout the application
- Meaningful error messages
- Proper HTTP status codes

## 🚧 Error Responses

### Insufficient Quantity
```json
{
  "success": false,
  "message": "Insufficient quantity available in inventory"
}
```

### Product Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Route Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

## 📝 Development Commands

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run in production mode
npm start

# Lint code
npm run lint

# Fix linting errors
npm run lint:fix
```

---

## 📚 Complete Documentation

### Getting Started
- **[README.md](./README.md)** - Project overview and setup (you are here!)
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide for beginners
- **[AUTH_QUICKSTART.md](./AUTH_QUICKSTART.md)** - Fast authentication testing guide

### API Documentation
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Complete authentication API reference (400+ lines)
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Products & orders API reference
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - One-page API quick reference card

### Testing & Data
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Comprehensive Postman testing tutorial
- **[SAMPLE_DATA.md](./SAMPLE_DATA.md)** - Ready-to-use test data & PowerShell scripts
- **[postman/auth-collection.json](./postman/auth-collection.json)** - Complete Postman collection

### Advanced Guides
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing strategies and examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview

---

## 🚀 Quick Test

Want to test right away? Run these commands:

```powershell
# Start server
npm run dev

# Register a user
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    role = "customer"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Save the token
$token = $response.data.token

# Get your profile
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" `
  -Method GET `
  -Headers @{ "Authorization" = "Bearer $token" }
```

✅ **Success!** You just registered and authenticated a user!

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Programming Hero for the assignment requirements
- MongoDB documentation
- Express.js documentation
- TypeScript documentation
