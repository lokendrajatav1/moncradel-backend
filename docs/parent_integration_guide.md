# Parent PWA Integration Guide

This guide contains all the APIs required to build the **Parent PWA**. 

### How to test:
Import the `parent_complete_postman.json` file from your backend folder into Postman.

### API Details:

### **POST** `/api/auth/register`
**Example Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "doctor"
}
```

---

### **POST** `/api/auth/login`
**Example Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### **POST** `/api/auth/send-otp`
**Example Request Body:**
```json
{
  "phone": "9876543210",
  "role": "parent"
}
```

---

### **POST** `/api/auth/verify-otp`
**Example Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "1234"
}
```

---

### **POST** `/api/auth/forgot-password`
**Example Request Body:**
```json
{
  "email": "john@example.com"
}
```

---

### **POST** `/api/auth/reset-password`
**Example Request Body:**
```json
{
  "token": "token-from-email-link-here",
  "otp": "1234",
  "email": "john@example.com",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

---

### **GET** `/api/users/profile`

---

### **PUT** `/api/users/profile`
**Example Request Body:**
```json
{
  "name": "Rahul Sharma",
  "husbandName": "Suresh Sharma",
  "pregnancyMonth": 5,
  "address": "123 Main St, Mumbai"
}
```

---

### **POST** `/api/babies`

---

### **GET** `/api/babies`

---

### **GET** `/api/babies/:id`

---

### **PUT** `/api/babies/:id`

---

### **GET** `/api/meals`

---

### **GET** `/api/meals/:id`

---

### **POST** `/api/orders`
**Example Request Body:**
```json
{
  "babyId": "64f719d3f1a2b3c4d5e6f7a8",
  "items": [
    { "productId": "64f719d3f1a2b3c4d5e6f7a8", "quantity": 1 }
  ],
  "addressId": "64f719d3f1a2b3c4d5e6f7a8",
  "totalAmount": 500,
  "paymentMethod": "online"
}
```

---

### **GET** `/api/orders`

---

### **PATCH** `/api/orders/:id/status`
**Example Request Body:**
```json
{
  "status": "preparing"
}
```

---

### **POST** `/api/reviews`
**Example Request Body:**
```json
{
  "mealId": "64f719d3f1a2b3c4d5e6f7a8",
  "orderId": "64f719d3f1a2b3c4d5e6f7a8",
  "rating": 5,
  "comment": "Great food!"
}
```

---

### **GET** `/api/reviews`

---

### **GET** `/api/reviews/:mealId`

---

### **PUT** `/api/reviews/:id`

---

### **DELETE** `/api/reviews/:id`

---

### **POST** `/api/support`
**Example Request Body:**
```json
{
  "subject": "Payment issue",
  "message": "My earnings for last week are not settled.",
  "priority": "high"
}
```

---

### **GET** `/api/support`

---

### **PUT** `/api/support/:id/reply`
**Example Request Body:**
```json
{
  "message": "Thank you, waiting for the resolution."
}
```

---

### **PUT** `/api/support/:id/reply/:replyId`

---

### **DELETE** `/api/support/:id/reply/:replyId`

---

### **POST** `/api/appointments`
**Example Request Body:**
```json
{
  "doctorId": "64f719d3f1a2b3c4d5e6f7a8",
  "babyId": "64f719d3f1a2b3c4d5e6f7a8",
  "date": "2024-12-01",
  "timeSlot": "10:00",
  "type": "online"
}
```

---

### **GET** `/api/appointments`

---

### **PUT** `/api/appointments/:id`
**Example Request Body:**
```json
{
  "date": "2024-12-02",
  "timeSlot": "11:30",
  "type": "clinic"
}
```

---

### **POST** `/api/growth`
**Example Request Body:**
```json
{
  "babyId": "64f719d3f1a2b3c4d5e6f7a8",
  "weight": 5.2,
  "height": 60,
  "headCircumference": 40,
  "recordedAt": "2024-11-01"
}
```

---

### **GET** `/api/growth/:babyId`

---

### **PUT** `/api/growth/:id`
**Example Request Body:**
```json
{
  "weight": 5.5,
  "height": 62,
  "headCircumference": 41
}
```

---

### **DELETE** `/api/growth/:id`

---

### **POST** `/api/payments`

---

### **PATCH** `/api/payments/:id/verify`

---

### **POST** `/api/subscriptions`

---

### **GET** `/api/subscriptions`

---

### **GET** `/api/subscription-plans`

---

### **GET** `/api/subscription-plans/:id`

---

### **GET** `/api/products`

---

### **GET** `/api/products/:id`

---

### **GET** `/api/nutrition-plans`

---

### **GET** `/api/nutrition-plans/:babyId`

---

### **GET** `/api/coupons`

---

### **POST** `/api/coupons/apply`

---

### **GET** `/api/settings`

---

### **GET** `/api/cart`

---

### **POST** `/api/cart`
**Example Request Body:**
```json
{
  "productId": "64f719d3f1a2b3c4d5e6f7a8",
  "quantity": 1
}
```

---

### **DELETE** `/api/cart`

---

### **POST** `/api/addresses`
**Example Request Body:**
```json
{
  "title": "Home",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "MH",
  "pincode": "400001",
  "phone": "9876543210"
}
```

---

### **GET** `/api/addresses`

---

### **PUT** `/api/addresses/:id`

---

### **DELETE** `/api/addresses/:id`

---

### **POST** `/api/milestones`

---

### **GET** `/api/milestones/:babyId`

---

### **PUT** `/api/milestones/:id`

---

### **DELETE** `/api/milestones/:id`

---

### **GET** `/api/standard-milestones`

---

### **GET** `/api/wallet`

---

### **POST** `/api/wallet/transaction`
