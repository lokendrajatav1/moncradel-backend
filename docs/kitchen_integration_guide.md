# Kitchen PWA Integration Guide

This guide contains all the APIs required to build the **Kitchen PWA**. 

### How to test:
Import the `kitchen_complete_postman.json` file from your backend folder into Postman.

### API List:
- **POST** `/api/auth/register`
- **POST** `/api/auth/login`
- **POST** `/api/auth/send-otp`
- **POST** `/api/auth/verify-otp`
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/reset-password`
- **GET** `/api/users/profile`
- **PUT** `/api/users/profile`
- **POST** `/api/meals`
- **GET** `/api/meals`
- **GET** `/api/meals/:id`
- **PUT** `/api/meals/:id`
- **DELETE** `/api/meals/:id`
- **GET** `/api/orders`
- **PATCH** `/api/orders/:id/status`
- **GET** `/api/reviews`
- **GET** `/api/reviews/:mealId`
- **GET** `/api/earnings`
- **POST** `/api/support`
- **GET** `/api/support`
- **PUT** `/api/support/:id/reply`
- **PUT** `/api/support/:id/reply/:replyId`
- **DELETE** `/api/support/:id/reply/:replyId`
- **GET** `/api/nutrition-plans`
- **GET** `/api/nutrition-plans/:babyId`
- **GET** `/api/inventory`
- **POST** `/api/inventory`
- **PUT** `/api/inventory/:id`
- **DELETE** `/api/inventory/:id`
- **POST** `/api/hygiene`
- **GET** `/api/hygiene`
- **PUT** `/api/hygiene/:id`
- **DELETE** `/api/hygiene/:id`
- **POST** `/api/batches`
- **GET** `/api/batches`
- **PATCH** `/api/batches/:id/status`
- **GET** `/api/settings`
