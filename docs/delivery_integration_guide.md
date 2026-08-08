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
  "name": "Raju Delivery",
  "vehicleNumber": "MH-01-AB-1234",
  "drivingLicense": "DL-1234567890",
  "vehicleType": "Bike",
  "address": "Borivali, Mumbai",
  "bankDetails": {
    "accountName": "Raju",
    "accountNumber": "123456789012",
    "ifscCode": "ICIC0001234",
    "bankName": "ICICI Bank"
  }
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

### **GET** `/api/settings`
