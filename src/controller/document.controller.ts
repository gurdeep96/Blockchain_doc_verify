import { Request, Response } from "express";
import documentService, { DocumentService } from "../service/document.service";
import userService from "../service/user.service";
import {
  decrypt,
  decryptBuffer,
  decryptBuffers,
  keyGen,
} from "../utils/helper";

export class DocumentController {
  constructor() {}

  async getDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await documentService.findOneDocument(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async getTotalStorage(req: Request, res: Response) {
    try {
      const response = await documentService.getFilesStorageSize();

      const data = response[0].SUM + " MB";
      res.status(200).send({ status: 200, result: data });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async getDocumentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { username, documents } = await documentService.findDocumentsByUser(
        Number(userId)
      );
      res.status(200).send({ status: 200, name: username, result: documents });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async getDocuments(req: Request, res: Response) {
    try {
      const response = await documentService.findAllDocument();
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async filterDocumentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { search } = req.body;
      const response = await documentService.searchDocumentsFilterByUser(
        Number(userId),
        search
      );
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async updateDocuments(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await documentService.updateDocument(
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

      const response = await documentService.deleteDocument(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async createDocument(req: Request, res: Response) {
    try {
      const Document: any = req.body;
      const { userId } = req.params;
      const response = await documentService.createDocument(Document, userId);
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
      const response = await documentService.assignDocument(DocumentId, userId);
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
      const response = await documentService.unassignDocument(
        DocumentId,
        userId
      );
      res.status(200).send({
        status: 201,
        result: response,
        message: "Document Unssigned!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }

  async fileUpload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: 400, result: "Kindly upload a file" });
      }
      const document = req.file;

      const body = req.body;
      const { userId } = res.locals.user;
      const user = req.params.userId;
      const result = await documentService.fileUpload(
        Number(user),
        document,
        body
      );

      res.status(201).send({ status: 201, result });
    } catch (error: any) {
      console.log("FIle upload error", error);
      res.status(500).send({ status: 500, error: error.message });
    }
  }

  async fileUploadIpfs(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: 400, result: "Kindly upload a file" });
      }
      const document = req.file;

      const body = req.body;
      const { userId } = res.locals.user;
      const user = req.params.userId;
      const result = await documentService.fileUploadIpfs(
        Number(user),
        document,
        body
      );

      res.status(201).send({ status: 201, result });
    } catch (error: any) {
      console.log("FIle ipfs upload error", error);
      res.status(500).send({ status: 500, message: error.message });
    }
  }

  async getFile(req: Request, res: Response) {
    try {
      const { docId } = req.query;
      if (!docId) {
        throw new Error("No Hash for File Passed!");
      }

      const { contentType, response } = await documentService.getFile(
        docId as string
      );
      const result = await response.arrayBuffer();
      const buffer = Buffer.from(result);
      const key = await keyGen(process.env.ENCRY_KEY as string);
      const resultDecrypt = await decryptBuffers(
        process.env.ENCRY_ALGO as string,
        key,
        buffer
      );
      res.setHeader("Content-Type", contentType);
      res.status(200).send(resultDecrypt);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  async verifyFileBlockChain(req: Request, res: Response) {
    try {
      const { hash } = req.body;
      if (!hash) {
        return res
          .status(400)
          .send({ code: 400, results: "Kindly enter some value" });
      }
      const results = await documentService.verifyFileBlockChain(hash);
      res.status(200).send({ code: 200, results });
    } catch (error) {
      console.log("VERIFY FILE ERR", error);
      res.status(500).send(error);
    }
  }
}
const documentController = new DocumentController();
export default documentController;
