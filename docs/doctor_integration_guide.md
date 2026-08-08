# Doctor PWA Integration Guide

This guide contains all the APIs required to build the **Doctor PWA**. 

### How to test:
Import the `doctor_complete_postman.json` file from your backend folder into Postman.

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
  "name": "Dr. Ramesh Gupta",
  "specialization": "Pediatrician",
  "experienceYears": 10,
  "clinicName": "Gupta Child Care",
  "clinicAddress": "123 Health Street, Delhi",
  "registrationNumber": "MCI-123456",
  "degrees": ["MBBS", "MD Pediatrics"],
  "qualifications": ["Child Nutrition Specialist"],
  "languagesSpoken": ["Hindi", "English"],
  "consultationFee": 500,
  "isAvailable": true,
  "timings": {
    "start": "09:00",
    "end": "17:00"
  },
  "bankDetails": {
    "accountName": "Ramesh Gupta",
    "accountNumber": "123456789012",
    "ifscCode": "SBIN0001234",
    "bankName": "State Bank of India"
  }
}
```

---

### **GET** `/api/babies`

---

### **GET** `/api/babies/:id`

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

### **PATCH** `/api/appointments/:id/status`
**Example Request Body:**
```json
{
  "status": "completed"
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

### **POST** `/api/prescriptions`
**Example Request Body:**
```json
{
  "babyId": "64f719d3f1a2b3c4d5e6f7a8",
  "medicines": [
    { "name": "Paracetamol", "dosage": "5ml", "timing": "Morning", "duration": "3 days" }
  ],
  "advice": "Rest well",
  "nextVisitDate": "2024-02-01"
}
```

---

### **GET** `/api/prescriptions`

---

### **GET** `/api/prescriptions/:babyId`

---

### **PUT** `/api/prescriptions/:id`
**Example Request Body:**
```json
{
  "advice": "Keep the baby hydrated",
  "nextVisitDate": "2024-03-01"
}
```

---

### **DELETE** `/api/prescriptions/:id`

---

### **POST** `/api/nutrition-plans`
**Example Request Body:**
```json
{
  "babyId": "64f719d3f1a2b3c4d5e6f7a8",
  "assignedBy": "64f719d3f1a2b3c4d5e6f7a8",
  "weeklySchedule": [
    { "day": "Monday", "mealId": "64f719d3f1a2b3c4d5e6f7a8" }
  ],
  "guidelines": "Drink water"
}
```

---

### **GET** `/api/nutrition-plans`

---

### **GET** `/api/nutrition-plans/:babyId`

---

### **PUT** `/api/nutrition-plans/:id`
**Example Request Body:**
```json
{
  "guidelines": "Increase water intake and add fruit purees"
}
```

---

### **GET** `/api/settings`

---

### **GET** `/api/milestones/:babyId`

---

### **GET** `/api/standard-milestones`
