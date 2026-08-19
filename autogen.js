const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes-dump.json');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const swagger = {
  openapi: "3.0.0",
  info: {
    title: 'moncradle Complete API',
    description: 'Auto-generated comprehensive Swagger API documentation',
    version: "1.0.0"
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
  security: [{ bearerAuth: [] }],
  paths: {}
};

routes.forEach(({ method, path: pathName }) => {
  if (!pathName || !pathName.startsWith('/api')) return;

  const swaggerPath = pathName.replace('/api', '').replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

  if (!swagger.paths[swaggerPath]) {
    swagger.paths[swaggerPath] = {};
  }

  const pathVars = swaggerPath.match(/{([^}]+)}/g) || [];

  const endpointDef = {
    summary: `${method.toUpperCase()} ${swaggerPath}`,
    tags: [swaggerPath.split('/')[1] || 'default'],
    responses: {
      200: { description: "Success" }
    }
  };

  if (pathVars.length > 0) {
    endpointDef.parameters = pathVars.map(v => ({
      name: v.replace(/[{}]/g, ''),
      in: "path",
      required: true,
      schema: { type: "string" }
    }));
  }

  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    endpointDef.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object"
          }
        }
      }
    };
  }

  swagger.paths[swaggerPath][method.toLowerCase()] = endpointDef;
});

const outputFile = path.join(__dirname, 'src', 'swagger.json');
fs.writeFileSync(outputFile, JSON.stringify(swagger, null, 2));
console.log("Swagger JSON successfully auto-generated at src/swagger.json!");
