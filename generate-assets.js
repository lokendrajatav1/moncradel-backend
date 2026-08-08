const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes-dump.json');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const artifactDir = path.join(__dirname, 'docs');
if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir);
}

const roleMappings = {
  doctor: {
    name: 'Doctor PWA',
    prefixes: ['/api/auth', '/api/users/profile', '/api/appointments', '/api/prescriptions', '/api/earnings', '/api/notifications/me', '/api/notifications/read', '/api/babies', '/api/nutrition-plans', '/api/growth', '/api/milestones', '/api/standard-milestones', '/api/support', '/api/settings'],
    exclude: ['POST /api/earnings', 'PUT /api/earnings/:id', 'DELETE /api/earnings/:id', 'PATCH /api/earnings/:id/pay', 'DELETE /api/appointments/:id', 'POST /api/babies', 'PUT /api/babies/:id', 'DELETE /api/babies/:id', 'DELETE /api/nutrition-plans/:id', 'POST /api/milestones', 'PUT /api/milestones/:id', 'DELETE /api/milestones/:id', 'POST /api/standard-milestones', 'PUT /api/standard-milestones/:id', 'DELETE /api/standard-milestones/:id', 'POST /api/settings', 'PUT /api/settings/:key', 'DELETE /api/settings/:key'],
    items: [],
    md: []
  },
  kitchen: {
    name: 'Kitchen PWA',
    prefixes: ['/api/auth', '/api/users/profile', '/api/orders', '/api/batches', '/api/hygiene', '/api/earnings', '/api/meals', '/api/notifications/me', '/api/notifications/read', '/api/nutrition-plans', '/api/inventory', '/api/support', '/api/settings', '/api/reviews'],
    exclude: ['POST /api/earnings', 'PUT /api/earnings/:id', 'DELETE /api/earnings/:id', 'PATCH /api/earnings/:id/pay', 'POST /api/orders', 'DELETE /api/orders/:id', 'DELETE /api/batches/:id', 'POST /api/nutrition-plans', 'PUT /api/nutrition-plans/:id', 'DELETE /api/nutrition-plans/:id', 'POST /api/settings', 'PUT /api/settings/:key', 'DELETE /api/settings/:key', 'POST /api/reviews', 'PUT /api/reviews/:id', 'DELETE /api/reviews/:id'],
    items: [],
    md: []
  },
  delivery: {
    name: 'Delivery PWA',
    prefixes: ['/api/auth', '/api/users/profile', '/api/orders', '/api/earnings', '/api/notifications/me', '/api/notifications/read', '/api/support', '/api/settings'],
    exclude: ['POST /api/earnings', 'PUT /api/earnings/:id', 'DELETE /api/earnings/:id', 'PATCH /api/earnings/:id/pay', 'POST /api/orders', 'DELETE /api/orders/:id', 'POST /api/settings', 'PUT /api/settings/:key', 'DELETE /api/settings/:key'],
    items: [],
    md: []
  },
  parent: {
    name: 'Parent PWA',
    prefixes: ['/api/auth', '/api/users/profile', '/api/babies', '/api/addresses', '/api/cart', '/api/orders', '/api/subscriptions', '/api/subscription-plans', '/api/reviews', '/api/support', '/api/appointments', '/api/growth', '/api/milestones', '/api/standard-milestones', '/api/payments', '/api/products', '/api/wallet', '/api/notifications/me', '/api/notifications/read', '/api/coupons', '/api/nutrition-plans', '/api/meals', '/api/settings'],
    exclude: ['POST /api/subscription-plans', 'PUT /api/subscription-plans/:id', 'PATCH /api/subscription-plans/:id', 'DELETE /api/subscription-plans/:id', 'PATCH /api/subscriptions/:id', 'DELETE /api/subscriptions/:id', 'POST /api/products', 'PUT /api/products/:id', 'DELETE /api/products/:id', 'POST /api/standard-milestones', 'PUT /api/standard-milestones/:id', 'DELETE /api/standard-milestones/:id', 'DELETE /api/appointments/:id', 'PATCH /api/appointments/:id/status', 'POST /api/coupons', 'PUT /api/coupons/:id', 'DELETE /api/coupons/:id', 'POST /api/nutrition-plans', 'PUT /api/nutrition-plans/:id', 'DELETE /api/nutrition-plans/:id', 'POST /api/meals', 'PUT /api/meals/:id', 'DELETE /api/meals/:id', 'POST /api/settings', 'PUT /api/settings/:key', 'DELETE /api/settings/:key'],
    items: [],
    md: []
  }

};

const payloadDictionary = {
  "POST /api/auth/register": '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "password123",\n  "phone": "9876543210",\n  "role": "doctor"\n}',
  "POST /api/auth/login": '{\n  "email": "john@example.com",\n  "password": "password123"\n}',
  "POST /api/auth/send-otp": '{\n  "phone": "9876543210",\n  "role": "parent"\n}',
  "POST /api/auth/verify-otp": '{\n  "phone": "9876543210",\n  "otp": "1234"\n}',
  "POST /api/auth/forgot-password": '{\n  "email": "john@example.com"\n}',
  "POST /api/auth/reset-password": '{\n  "token": "token-from-email-link-here",\n  "otp": "1234",\n  "email": "john@example.com",\n  "password": "newpassword123",\n  "confirmPassword": "newpassword123"\n}',
  "PUT /api/users/profile": '{\n  "name": "Updated Name",\n  "address": "123 Main St",\n  "specialization": "Pediatrician",\n  "vehicleNumber": "MH01AB1234",\n  "kitchenName": "Healthy Bites"\n}',
  "POST /api/prescriptions": '{\n  "babyId": "64f719d3f1a2b3c4d5e6f7a8",\n  "medicines": [\n    { "name": "Paracetamol", "dosage": "5ml", "timing": "Morning", "duration": "3 days" }\n  ],\n  "advice": "Rest well",\n  "nextVisitDate": "2024-02-01"\n}',
  "POST /api/appointments": '{\n  "doctorId": "64f719d3f1a2b3c4d5e6f7a8",\n  "babyId": "64f719d3f1a2b3c4d5e6f7a8",\n  "date": "2024-12-01",\n  "timeSlot": "10:00",\n  "type": "online"\n}',
  "PATCH /api/appointments/:id/status": '{\n  "status": "completed"\n}',
  "POST /api/nutrition-plans": '{\n  "babyId": "64f719d3f1a2b3c4d5e6f7a8",\n  "assignedBy": "64f719d3f1a2b3c4d5e6f7a8",\n  "weeklySchedule": [\n    { "day": "Monday", "mealId": "64f719d3f1a2b3c4d5e6f7a8" }\n  ],\n  "guidelines": "Drink water"\n}',
  "POST /api/orders": '{\n  "babyId": "64f719d3f1a2b3c4d5e6f7a8",\n  "items": [\n    { "productId": "64f719d3f1a2b3c4d5e6f7a8", "quantity": 1 }\n  ],\n  "addressId": "64f719d3f1a2b3c4d5e6f7a8",\n  "totalAmount": 500,\n  "paymentMethod": "online"\n}',
  "PATCH /api/orders/:id/status": '{\n  "status": "preparing"\n}',
  "POST /api/addresses": '{\n  "title": "Home",\n  "street": "123 Main St",\n  "city": "Mumbai",\n  "state": "MH",\n  "pincode": "400001",\n  "phone": "9876543210"\n}',
  "POST /api/cart": '{\n  "productId": "64f719d3f1a2b3c4d5e6f7a8",\n  "quantity": 1\n}',
  "POST /api/reviews": '{\n  "mealId": "64f719d3f1a2b3c4d5e6f7a8",\n  "orderId": "64f719d3f1a2b3c4d5e6f7a8",\n  "rating": 5,\n  "comment": "Great food!"\n}'
};

const createPostmanReq = (pathName, method) => {
  const urlPath = pathName.split('/').filter(p => p);
  const pathVars = urlPath.filter(p => p.startsWith(':')).map(p => p.replace(':', ''));
  
  const req = {
    method: method.toUpperCase(),
    header: [],
    url: {
      raw: `{{baseUrl}}/${urlPath.join('/')}`,
      host: ["{{baseUrl}}"],
      path: urlPath,
      variable: pathVars.map(v => ({ key: v, value: "64f719d3f1a2b3c4d5e6f7a8" }))
    }
  };
  
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    const key = `${method.toUpperCase()} ${pathName}`;
    const rawBody = payloadDictionary[key] || "{\n  \n}";
    req.body = { mode: "raw", raw: rawBody, options: { raw: { language: "json" } } };
  }
  
  return {
    name: `${method.toUpperCase()} ${pathName}`,
    request: req
  };
};

const createCollection = (name, items) => {
  return {
    info: {
      name: `Moncradel - ${name}`,
      description: `Complete auto-generated collection for ${name}`,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
      { key: "baseUrl", value: "http://localhost:5000", type: "string" },
      { key: "token", value: "", type: "string" }
    ],
    auth: {
      type: "bearer",
      bearer: [{ key: "token", value: "{{token}}", type: "string" }]
    },
    item: items
  };
};

// Process Routes
routes.forEach(({ method, path: pathName }) => {
  if (!pathName || !pathName.startsWith('/api')) return;
  
  for (const [roleKey, roleData] of Object.entries(roleMappings)) {
    if (roleData.prefixes.some(prefix => pathName.startsWith(prefix))) {
      const fullRoute = `${method.toUpperCase()} ${pathName}`;
      if (roleData.exclude && roleData.exclude.includes(fullRoute)) {
        continue;
      }
      // Find or create folder in Postman
      const folderName = pathName.split('/')[2] || 'Common';
      let folder = roleData.items.find(i => i.name === folderName);
      if (!folder) {
        folder = { name: folderName, item: [] };
        roleData.items.push(folder);
      }
      folder.item.push(createPostmanReq(pathName, method));
      
      // Add to MD
      let mdBlock = `### **${method.toUpperCase()}** \`${pathName}\``;
      const key = `${method.toUpperCase()} ${pathName}`;
      if (payloadDictionary[key]) {
        mdBlock += `\n**Example Request Body:**\n\`\`\`json\n${payloadDictionary[key]}\n\`\`\``;
      }
      roleData.md.push(mdBlock);
    }
  }
});

// Generate Files
for (const [roleKey, roleData] of Object.entries(roleMappings)) {
  // Postman
  const colFile = path.join(__dirname, `${roleKey}_complete_postman.json`);
  fs.writeFileSync(colFile, JSON.stringify(createCollection(roleData.name, roleData.items), null, 2));
  console.log(`Generated: ${colFile}`);
  
  // Markdown Guide
  const mdFile = path.join(artifactDir, `${roleKey}_integration_guide.md`);
  const mdContent = `# ${roleData.name} Integration Guide\n\nThis guide contains all the APIs required to build the **${roleData.name}**. \n\n### How to test:\nImport the \`${roleKey}_complete_postman.json\` file from your backend folder into Postman.\n\n### API Details:\n\n${roleData.md.join('\n\n---\n\n')}\n`;
  fs.writeFileSync(mdFile, mdContent);
  console.log(`Generated Artifact: ${mdFile}`);
}

console.log("All complete collections and guides generated successfully!");
