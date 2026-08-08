# Delivery PWA Integration Guide

This guide contains all the APIs required to build the **Delivery PWA**. 

### How to test:
Import the `delivery_complete_postman.json` file from your backend folder into Postman.

### API List:
- **POST** `/api/auth/register`
- **POST** `/api/auth/login`
- **POST** `/api/auth/send-otp`
- **POST** `/api/auth/verify-otp`
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/reset-password`
- **GET** `/api/users/profile`
- **PUT** `/api/users/profile`
- **GET** `/api/orders`
- **PATCH** `/api/orders/:id/status`
- **GET** `/api/earnings`
- **POST** `/api/support`
- **GET** `/api/support`
- **PUT** `/api/support/:id/reply`
- **PUT** `/api/support/:id/reply/:replyId`
- **DELETE** `/api/support/:id/reply/:replyId`
- **GET** `/api/settings`
