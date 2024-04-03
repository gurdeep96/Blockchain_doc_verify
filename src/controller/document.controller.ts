import { Request, Response } from "express";
import DocumentService from "../service/document.service";

export class DocumentController {
  constructor() {}
  async getDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await DocumentService.findOneDocument(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async getDocuments(req: Request, res: Response) {
    try {
      const response = await DocumentService.findAllDocument();
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async updateDocuments(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await DocumentService.updateDocument(
        Number(id),
        req.body
      );
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await DocumentService.deleteDocument(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async createDocument(req: Request, res: Response) {
    try {
      const Document: any = req.body;
      const { userId } = req.params;
      const response = await DocumentService.createDocument(Document, userId);
      res
        .status(200)
        .send({ status: 201, result: response, message: "Document Created!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }

  async assignDocument(req: Request, res: Response) {
    try {
      const { userId, DocumentId } = req.params;
      const response = await DocumentService.assignDocument(DocumentId, userId);
      res
        .status(200)
        .send({ status: 201, result: response, message: "Document Assigned!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }

  async unassignDocument(req: Request, res: Response) {
    try {
      const { userId, DocumentId } = req.params;
      const response = await DocumentService.unassignDocument(
        DocumentId,
        userId
      );
      res
        .status(200)
        .send({
          status: 201,
          result: response,
          message: "Document Unssigned!",
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
}
const documentController = new DocumentController();
export default documentController;
