# Kitchen PWA Integration Guide

This guide contains all the APIs and instructions required for Frontend Developers to build the **Kitchen PWA**.

> [!TIP]
> **Easiest way to test:** Import the `kitchen_complete_postman.json` file from your backend folder directly into Postman. It contains all the exact request bodies, endpoints, and authentication configurations ready to use.

---

## 1. Base Configuration

All API requests should be prefixed with the Base URL.

- **Base URL (Local Development):** `http://localhost:5000`
- **Base URL (Production/Staging):** *[Ask backend team for live URL]*

---

## 2. Authentication

Most APIs require a valid JWT token to authenticate the user.

- **Header format:** `Authorization: Bearer <your_jwt_token>`
- **How to get it:** You will receive this token in the response when you call the `/api/auth/login` or `/api/auth/register` API.
- **Where to store it:** Store the token in `localStorage` or a global state manager (like Redux/Zustand) upon login.

---

## 3. Common Error & Success Responses

### Success (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error (HTTP 400 / 401 / 404 / 500)
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 4. API Endpoints Reference

### 🔐 AUTHENTICATION
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/auth/register` | Register a new kitchen partner | No |
| **POST** | `/api/auth/login` | Login and get JWT token | No |
| **POST** | `/api/auth/send-otp` | Request OTP for verification | No |
| **POST** | `/api/auth/verify-otp` | Verify the received OTP | No |
| **POST** | `/api/auth/forgot-password` | Send password reset link/OTP | No |
| **POST** | `/api/auth/reset-password` | Reset password using token | No |

### 👤 USER PROFILE
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/users/profile` | Get logged-in kitchen details | Yes |
| **PUT** | `/api/users/profile` | Update profile (kitchen name, etc) | Yes |

### 🍽️ MEALS MANAGEMENT
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/meals` | Create a new meal offering | Yes |
| **GET** | `/api/meals` | Get list of kitchen's meals | Yes |
| **GET** | `/api/meals/:id` | Get details of a specific meal | Yes |
| **PUT** | `/api/meals/:id` | Update an existing meal | Yes |
| **DELETE**| `/api/meals/:id` | Delete a meal | Yes |

### 📦 ORDERS & BATCHES
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/orders` | Get assigned or active orders | Yes |
| **PATCH**| `/api/orders/:id/status` | Update order status (Preparing, etc)| Yes |
| **POST** | `/api/batches` | Create a new food prep batch | Yes |
| **GET** | `/api/batches` | List all food preparation batches | Yes |
| **PATCH**| `/api/batches/:id/status`| Update batch status | Yes |

### 🥦 INVENTORY & HYGIENE
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/inventory` | Add an item to inventory | Yes |
| **GET** | `/api/inventory` | List current inventory items | Yes |
| **PUT** | `/api/inventory/:id` | Update an inventory item | Yes |
| **DELETE**| `/api/inventory/:id` | Remove an inventory item | Yes |
| **POST** | `/api/hygiene` | Log a hygiene/cleaning activity | Yes |
| **GET** | `/api/hygiene` | Get hygiene logs | Yes |
| **PUT** | `/api/hygiene/:id` | Update a hygiene log | Yes |
| **DELETE**| `/api/hygiene/:id` | Delete a hygiene log | Yes |

### ⭐ REVIEWS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/reviews` | Get all reviews for the kitchen | Yes |
| **GET** | `/api/reviews/:mealId` | Get reviews for a specific meal | Yes |

### 🥗 NUTRITION PLANS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/nutrition-plans` | View assigned nutrition plans | Yes |
| **GET** | `/api/nutrition-plans/:babyId`| View nutrition plan for a baby | Yes |

### 💰 EARNINGS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/earnings` | Get kitchen earnings history | Yes |

### 🎧 SUPPORT TICKETS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/support` | Create a support ticket | Yes |
| **GET** | `/api/support` | List support tickets | Yes |
| **PUT** | `/api/support/:id/reply` | Reply to a support ticket | Yes |
| **PUT** | `/api/support/:id/reply/:replyId`| Update a specific reply | Yes |
| **DELETE**| `/api/support/:id/reply/:replyId`| Delete a specific reply | Yes |

### ⚙️ SETTINGS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/settings` | Get global app settings | Yes |
