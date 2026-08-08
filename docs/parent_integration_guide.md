# Parent PWA Integration Guide

This guide contains all the APIs required to build the **Parent PWA**. 

### How to test:
Import the `parent_complete_postman.json` file from your backend folder into Postman.

### API List:
- **POST** `/api/auth/register`
- **POST** `/api/auth/login`
- **POST** `/api/auth/send-otp`
- **POST** `/api/auth/verify-otp`
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/reset-password`
- **GET** `/api/users/profile`
- **PUT** `/api/users/profile`
- **POST** `/api/babies`
- **GET** `/api/babies`
- **GET** `/api/babies/:id`
- **PUT** `/api/babies/:id`
- **GET** `/api/meals`
- **GET** `/api/meals/:id`
- **POST** `/api/orders`
- **GET** `/api/orders`
- **PATCH** `/api/orders/:id/status`
- **POST** `/api/reviews`
- **GET** `/api/reviews`
- **GET** `/api/reviews/:mealId`
- **PUT** `/api/reviews/:id`
- **DELETE** `/api/reviews/:id`
- **POST** `/api/support`
- **GET** `/api/support`
- **PUT** `/api/support/:id/reply`
- **PUT** `/api/support/:id/reply/:replyId`
- **DELETE** `/api/support/:id/reply/:replyId`
- **POST** `/api/appointments`
- **GET** `/api/appointments`
- **PUT** `/api/appointments/:id`
- **POST** `/api/growth`
- **GET** `/api/growth/:babyId`
- **PUT** `/api/growth/:id`
- **DELETE** `/api/growth/:id`
- **POST** `/api/payments`
- **PATCH** `/api/payments/:id/verify`
- **POST** `/api/subscriptions`
- **GET** `/api/subscriptions`
- **GET** `/api/subscription-plans`
- **GET** `/api/subscription-plans/:id`
- **GET** `/api/products`
- **GET** `/api/products/:id`
- **GET** `/api/nutrition-plans`
- **GET** `/api/nutrition-plans/:babyId`
- **GET** `/api/coupons`
- **POST** `/api/coupons/apply`
- **GET** `/api/settings`
- **GET** `/api/cart`
- **POST** `/api/cart`
- **DELETE** `/api/cart`
- **POST** `/api/addresses`
- **GET** `/api/addresses`
- **PUT** `/api/addresses/:id`
- **DELETE** `/api/addresses/:id`
- **POST** `/api/milestones`
- **GET** `/api/milestones/:babyId`
- **PUT** `/api/milestones/:id`
- **DELETE** `/api/milestones/:id`
- **GET** `/api/standard-milestones`
- **GET** `/api/wallet`
- **POST** `/api/wallet/transaction`
