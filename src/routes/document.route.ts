import express, { Router } from "express";
import documentController from "../controller/document.controller"; // Assuming TypeScript file extension is .ts
import {
  adminAuthorize,
  authMiddleware,
  multerSingle,
} from "../middleware/auth";

const DocumentRouter: Router = express.Router();

DocumentRouter.get(
  "/documents",
  authMiddleware,
  documentController.getDocuments
);
DocumentRouter.get(
  "/documents/user/:userId",
  authMiddleware,
  documentController.getDocumentsByUser
);
DocumentRouter.post(
  "/documents/search/:userId",
  authMiddleware,
  documentController.filterDocumentsByUser
);
DocumentRouter.get(
  "/documents/storage-size",
  authMiddleware,
  adminAuthorize,
  documentController.getTotalStorage
);
DocumentRouter.put(
  "/assigndocument/:userId/:DocumentId",
  authMiddleware,
  documentController.assignDocument
);
DocumentRouter.put(
  "/unassigndocument/:userId/:DocumentId",
  authMiddleware,
  documentController.unassignDocument
);
DocumentRouter.post(
  "/createdocument/:userId",
  authMiddleware,
  documentController.createDocument
);
DocumentRouter.post("/createdocument", documentController.createDocument);
DocumentRouter.put(
  "/updatedocument/:id",
  authMiddleware,
  documentController.updateDocuments
);
DocumentRouter.delete(
  "/deletedocument/:id",
  authMiddleware,
  documentController.deleteDocument
);
DocumentRouter.post(
  "/documentupload/:userId",
  authMiddleware,
  adminAuthorize,
  multerSingle,
  documentController.fileUpload
);

// Frontend doing contract transaction call method
DocumentRouter.post(
  "/docupload/:userId",
  authMiddleware,
  adminAuthorize,
  multerSingle,
  documentController.fileUploadIpfs
);
DocumentRouter.get("/getfile", authMiddleware, documentController.getFile);
DocumentRouter.post(
  "/checkfileauthenticity",
  authMiddleware,
  documentController.verifyFileBlockChain
);

export default DocumentRouter;
