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

/**
 * @swagger
 * /documents/search/{userId}:
 *      post:
 *          summary: Filter document Search
 *          tags:
 *              - Document
 *          description: Search for documents among the all documents for a particular user id.
 *          parameters:
 *           - in: path
 *             name: userId   # Note the name is the same as in the path
 *             required: true
 *             type: integer
 *             minimum: 1
 *             description: The user ID.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              search:
 *                                  type: string
 *                                  example: abcd
 *       
 *        
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: number
 *                                      example: 200
 *                                  count:
 *                                      type: number
 *                                      example: 1
 *                                  result:
 *                                      type: object
 *                                      example:  [{
                                                          "title": "randomName",
                                                          "fileName": "",
                                                          "documentPath": "QmWoQJVvuU4PExC7GAvdoQKfVQ1GRh1jtb4SrabEbvXmPU/0",
                                                          "hash": "269329fc7ae54b3f289b3ac52efde387edc2e566ef9a48d637e841022c7e0eab",
                                                          "transactionId": null,
                                                          "issuer": "",
                                                          "fileIdentifier": null,
                                                          "fileSizeMB": null,
                                                          "createdAt": "2024-04-03T14:18:12.000Z",
                                                          "updatedAt": "2024-04-03T14:18:12.000Z"
                                                      }]
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
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
  "/updatedocument/:id",
  authMiddleware,
  documentController.updateDocuments
);
DocumentRouter.put(
  "/document/updatetransaction/:id",
  authMiddleware,
  documentController.updateTxIdByDocId
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
DocumentRouter.get(
  "/withdraw-wallet",
  authMiddleware,
  documentController.withdrawBlockChain
);

export default DocumentRouter;
