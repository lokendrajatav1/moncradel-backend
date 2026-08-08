# Delivery PWA Integration Guide

This guide contains all the APIs required to build the **Delivery PWA**. 

### How to test:
Import the `delivery_complete_postman.json` file from your backend folder into Postman.

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
  "name": "Updated Name",
  "address": "123 Main St",
  "specialization": "Pediatrician",
  "vehicleNumber": "MH01AB1234",
  "kitchenName": "Healthy Bites"
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

### **GET** `/api/earnings`

---

### **POST** `/api/support`

---

### **GET** `/api/support`

---

### **PUT** `/api/support/:id/reply`

---

### **PUT** `/api/support/:id/reply/:replyId`

---

### **DELETE** `/api/support/:id/reply/:replyId`

---

### **GET** `/api/settings`
