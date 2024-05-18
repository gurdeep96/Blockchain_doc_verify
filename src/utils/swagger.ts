import { Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blockchain Doc Verify App API Endpoints",
      description:
        "API endpoints Blockchain Smart Contract Document Verify App on Swagger",
      contact: {
        name: "Gurdeep Singh",
        email: "",
        url: "https://github.com/Gurdeep-Techvalens/blockchain-doc-verify",
      },
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "<your live url here>",
        description: "Live server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["dist/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app: any, port: any) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;
