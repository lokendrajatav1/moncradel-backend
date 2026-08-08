# Kitchen PWA Integration Guide

This guide contains all the APIs required to build the **Kitchen PWA**. 

### How to test:
Import the `kitchen_complete_postman.json` file from your backend folder into Postman.

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
  "name": "Healthy Bites Owner",
  "kitchenName": "Healthy Bites Kitchen",
  "fssaiNumber": "FSSAI-987654321",
  "address": "Andheri West, Mumbai",
  "operatingHours": {
    "open": "07:00",
    "close": "22:00"
  },
  "bankDetails": {
    "accountName": "Healthy Bites",
    "accountNumber": "123456789012",
    "ifscCode": "HDFC0001234",
    "bankName": "HDFC Bank"
  }
}
```

---

### **POST** `/api/meals`

---

### **GET** `/api/meals`

---

### **GET** `/api/meals/:id`

---

### **PUT** `/api/meals/:id`

---

### **DELETE** `/api/meals/:id`

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

### **GET** `/api/reviews`

---

### **GET** `/api/reviews/:mealId`

---

### **GET** `/api/earnings`

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

### **GET** `/api/nutrition-plans`

---

### **GET** `/api/nutrition-plans/:babyId`

---

### **GET** `/api/inventory`

---

### **POST** `/api/inventory`

---

### **PUT** `/api/inventory/:id`

---

### **DELETE** `/api/inventory/:id`

---

### **POST** `/api/hygiene`

---

### **GET** `/api/hygiene`

---

### **PUT** `/api/hygiene/:id`

---

### **DELETE** `/api/hygiene/:id`

---

### **POST** `/api/batches`

---

### **GET** `/api/batches`

---

### **PATCH** `/api/batches/:id/status`

---

### **GET** `/api/settings`
