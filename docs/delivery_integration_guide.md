# Delivery PWA Integration Guide

This guide contains all the APIs and instructions required for Frontend Developers to build the **Delivery PWA**.

> [!TIP]
> **Easiest way to test:** Import the `delivery_complete_postman.json` file from your backend folder directly into Postman. It contains all the exact request bodies, endpoints, and authentication configurations ready to use.

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
| **POST** | `/api/auth/register` | Register a new delivery partner | No |
| **POST** | `/api/auth/login` | Login and get JWT token | No |
| **POST** | `/api/auth/send-otp` | Request OTP for verification | No |
| **POST** | `/api/auth/verify-otp` | Verify the received OTP | No |
| **POST** | `/api/auth/forgot-password` | Send password reset link/OTP | No |
| **POST** | `/api/auth/reset-password` | Reset password using token | No |

### 👤 USER PROFILE
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/users/profile` | Get logged-in partner details | Yes |
| **PUT** | `/api/users/profile` | Update profile (vehicle info, etc) | Yes |

### 📦 ORDERS & DELIVERIES
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/orders` | Get assigned or pending orders | Yes |
| **PATCH**| `/api/orders/:id/status` | Update delivery status (Picked, Delivered) | Yes |

### 💰 EARNINGS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/earnings` | Get delivery earnings history | Yes |

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
