const fs = require('fs');

const swagger = {
  openapi: "3.0.0",
  info: {
    title: "Moncradel API",
    version: "1.0.0",
    description: "API Documentation for Moncradel PWAs (Doctor, Kitchen, Delivery, Parent)"
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local Development Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [
    { bearerAuth: [] }
  ],
  paths: {
    "/users/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } }
              }
            }
          }
        },
        responses: { 200: { description: "Successful login" } }
      }
    },
    "/users/profile": {
      get: { tags: ["Auth"], summary: "Get User Profile", responses: { 200: { description: "Profile retrieved" } } },
      put: { tags: ["Auth"], summary: "Update User Profile", responses: { 200: { description: "Profile updated" } } }
    },
    "/appointments": {
      get: { tags: ["Appointments"], summary: "Get my appointments", responses: { 200: { description: "Success" } } },
      post: { tags: ["Appointments"], summary: "Book an appointment", responses: { 200: { description: "Success" } } }
    },
    "/appointments/{id}/status": {
      patch: { 
        tags: ["Appointments"], 
        summary: "Update appointment status", 
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Success" } }
      }
    },
    "/prescriptions": {
      get: { tags: ["Prescriptions"], summary: "Get all prescriptions", responses: { 200: { description: "Success" } } },
      post: { tags: ["Prescriptions"], summary: "Create prescription", responses: { 200: { description: "Success" } } }
    },
    "/prescriptions/{babyId}": {
      get: { tags: ["Prescriptions"], summary: "Get baby's prescriptions", parameters: [{ name: "babyId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Success" } } }
    },
    "/babies": {
      get: { tags: ["Babies"], summary: "Get babies", responses: { 200: { description: "Success" } } },
      post: { tags: ["Babies"], summary: "Add a baby", responses: { 200: { description: "Success" } } }
    },
    "/orders": {
      get: { tags: ["Orders"], summary: "Get orders", responses: { 200: { description: "Success" } } },
      post: { tags: ["Orders"], summary: "Place new order", responses: { 200: { description: "Success" } } }
    },
    "/orders/{id}/status": {
      patch: { tags: ["Orders"], summary: "Update order status", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Success" } } }
    },
    "/earnings": {
      get: { tags: ["Earnings"], summary: "Get user earnings", responses: { 200: { description: "Success" } } }
    }
  }
};

fs.writeFileSync('src/swagger.json', JSON.stringify(swagger, null, 2));
console.log('Swagger generated at src/swagger.json');
