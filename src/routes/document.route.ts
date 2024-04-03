import express, { Router } from "express";
import DocumentController from "../controller/document.controller"; // Assuming TypeScript file extension is .ts

const DocumentRouter: Router = express.Router();

DocumentRouter.get("/getDocuments", DocumentController.getDocuments);
DocumentRouter.get("/getDocument/:id", DocumentController.getDocument);
DocumentRouter.put(
  "/assignDocument/:userId/:DocumentId",
  DocumentController.assignDocument
);
DocumentRouter.put(
  "/unassignDocument/:userId/:DocumentId",
  DocumentController.unassignDocument
);
DocumentRouter.post(
  "/createDocument/:userId",
  DocumentController.createDocument
);
DocumentRouter.post("/createDocument", DocumentController.createDocument);
DocumentRouter.put("/updateDocument/:id", DocumentController.updateDocuments);
DocumentRouter.delete("/deleteDocument/:id", DocumentController.deleteDocument);

export default DocumentRouter;
