# Parent PWA Integration Guide

This guide contains all the APIs and instructions required for Frontend Developers to build the **Parent PWA**.

> [!TIP]
> **Easiest way to test:** Import the `parent_complete_postman.json` file from your backend folder directly into Postman. It contains all the exact request bodies, endpoints, and authentication configurations ready to use.

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
| **POST** | `/api/auth/register` | Register a new parent | No |
| **POST** | `/api/auth/login` | Login and get JWT token | No |
| **POST** | `/api/auth/send-otp` | Request OTP for verification | No |
| **POST** | `/api/auth/verify-otp` | Verify the received OTP | No |
| **POST** | `/api/auth/forgot-password` | Send password reset link/OTP | No |
| **POST** | `/api/auth/reset-password` | Reset password using token | No |

### 👤 USER PROFILE
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/users/profile` | Get logged-in user details | Yes |
| **PUT** | `/api/users/profile` | Update profile (name, address, etc) | Yes |

### 👶 BABIES
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/babies` | Add a new baby profile | Yes |
| **GET** | `/api/babies` | List all babies for the parent | Yes |
| **GET** | `/api/babies/:id` | Get details of a specific baby | Yes |
| **PUT** | `/api/babies/:id` | Update baby profile | Yes |

### 🍽️ MEALS & NUTRITION
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/meals` | Get list of available meals | Yes |
| **GET** | `/api/meals/:id` | Get single meal details | Yes |
| **GET** | `/api/nutrition-plans` | Get all nutrition plans | Yes |
| **GET** | `/api/nutrition-plans/:babyId`| Get nutrition plan for a baby | Yes |

### 🛒 CART & ORDERS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/cart` | Get current cart items | Yes |
| **POST** | `/api/cart` | Add/Update item in cart | Yes |
| **DELETE**| `/api/cart` | Clear cart | Yes |
| **POST** | `/api/orders` | Place a new order | Yes |
| **GET** | `/api/orders` | Get order history | Yes |
| **PATCH**| `/api/orders/:id/status` | Update order status (Cancel, etc)| Yes |

### ⭐ REVIEWS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/reviews` | Submit a review for a meal/order| Yes |
| **GET** | `/api/reviews` | Get all reviews by the parent | Yes |
| **GET** | `/api/reviews/:mealId` | Get reviews for a specific meal | Yes |
| **PUT** | `/api/reviews/:id` | Update a review | Yes |
| **DELETE**| `/api/reviews/:id` | Delete a review | Yes |

### 📅 APPOINTMENTS & DOCTORS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/appointments` | Book a new appointment | Yes |
| **GET** | `/api/appointments` | Get parent's appointments | Yes |
| **PUT** | `/api/appointments/:id` | Update appointment details/status| Yes |

### 📈 BABY GROWTH & MILESTONES
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/growth` | Log new growth record (weight, etc)| Yes |
| **GET** | `/api/growth/:babyId` | Get growth history for baby | Yes |
| **PUT** | `/api/growth/:id` | Update a growth record | Yes |
| **DELETE**| `/api/growth/:id` | Delete a growth record | Yes |
| **POST** | `/api/milestones` | Log a custom milestone | Yes |
| **GET** | `/api/milestones/:babyId`| Get baby's achieved milestones | Yes |
| **GET** | `/api/standard-milestones`| Get predefined standard milestones | Yes |

### 💳 PAYMENTS & WALLET
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **POST** | `/api/payments` | Initiate a payment | Yes |
| **PATCH**| `/api/payments/:id/verify`| Verify payment success | Yes |
| **GET** | `/api/wallet` | Get wallet balance & history | Yes |
| **POST** | `/api/wallet/transaction`| Add/deduct wallet money | Yes |

### 🎫 SUBSCRIPTIONS & COUPONS
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/subscriptions` | Get active subscriptions | Yes |
| **GET** | `/api/subscription-plans` | Get available plans | Yes |
| **GET** | `/api/coupons` | List valid coupons | Yes |
| **POST** | `/api/coupons/apply` | Apply coupon to cart | Yes |

### 📍 ADDRESSES & SUPPORT
| Method | Endpoint | Description | Requires Token? |
|--------|----------|-------------|----------------|
| **GET** | `/api/addresses` | Get saved addresses | Yes |
| **POST** | `/api/addresses` | Add a new address | Yes |
| **PUT** | `/api/addresses/:id` | Update an address | Yes |
| **DELETE**| `/api/addresses/:id` | Delete an address | Yes |
| **POST** | `/api/support` | Create a support ticket | Yes |
| **GET** | `/api/support` | List support tickets | Yes |
