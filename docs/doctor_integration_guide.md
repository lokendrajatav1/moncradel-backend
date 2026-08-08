# Doctor PWA Integration Guide

This guide contains all the APIs required to build the **Doctor PWA**. 

### How to test:
Import the `doctor_complete_postman.json` file from your backend folder into Postman.

### API List:
- **POST** `/api/auth/register`
- **POST** `/api/auth/login`
- **POST** `/api/auth/send-otp`
- **POST** `/api/auth/verify-otp`
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/reset-password`
- **GET** `/api/users/profile`
- **PUT** `/api/users/profile`
- **GET** `/api/babies`
- **GET** `/api/babies/:id`
- **GET** `/api/earnings`
- **POST** `/api/support`
- **GET** `/api/support`
- **PUT** `/api/support/:id/reply`
- **PUT** `/api/support/:id/reply/:replyId`
- **DELETE** `/api/support/:id/reply/:replyId`
- **POST** `/api/appointments`
- **GET** `/api/appointments`
- **PUT** `/api/appointments/:id`
- **PATCH** `/api/appointments/:id/status`
- **POST** `/api/growth`
- **GET** `/api/growth/:babyId`
- **PUT** `/api/growth/:id`
- **DELETE** `/api/growth/:id`
- **POST** `/api/prescriptions`
- **GET** `/api/prescriptions`
- **GET** `/api/prescriptions/:babyId`
- **PUT** `/api/prescriptions/:id`
- **DELETE** `/api/prescriptions/:id`
- **POST** `/api/nutrition-plans`
- **GET** `/api/nutrition-plans`
- **GET** `/api/nutrition-plans/:babyId`
- **PUT** `/api/nutrition-plans/:id`
- **GET** `/api/settings`
- **GET** `/api/milestones/:babyId`
- **GET** `/api/standard-milestones`
