import { Request, Response } from "express";
import documentService, { DocumentService } from "../service/document.service";
import userService from "../service/user.service";
import {
  decrypt,
  decryptBuffer,
  decryptBuffers,
  keyGen,
} from "../utils/helper";
import createHttpError from "http-errors";

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
      const { username, documents, count } =
        await documentService.findDocumentsByUser(Number(userId));
      res
        .status(200)
        .send({ status: 200, name: username, count: count, result: documents });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }

  async getDocuments(req: Request, res: Response) {
    try {
      const response = await documentService.findAllDocument();
      res.status(200).send({ status: 200, result: response });
    } catch (error: any) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }

  async filterDocumentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { search } = req.body;
      const { count, response } =
        await documentService.searchDocumentsFilterByUser(
          Number(userId),
          search
        );
      res.status(200).send({ status: 200, count: count, result: response });
    } catch (error: any) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }

  async updateTxIdByDocId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { txId } = req.body;

      const response = await documentService.updateTxIdByDocId(
        Number(id),
        txId
      );
      res.status(200).send({ status: 200, result: response });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
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
      res.status(500).send({ result: error });
    }
  }

  async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await documentService.deleteDocument(Number(id));
      res.status(200).send({ status: 200, result: response });
    } catch (error) {
      res.status(500).send({ result: error });
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
      console.log("File upload error", error);
      res.status(500).send({ status: 500, error: error.message });
    }
  }

  async fileUploadIpfs(req: Request, res: Response) {
    try {
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
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }

  async getFile(req: Request, res: Response) {
    try {
      const { docId } = req.query;

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
    } catch (error: any) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }

  async verifyFileBlockChain(req: Request, res: Response) {
    try {
      const { hash, option } = req.body;

      const result = await documentService.verifyFileBlockChain(hash, option);
      res.status(200).send({ status: 200, result });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }

  async withdrawBlockChain(req: Request, res: Response) {
    try {
      const result = await documentService.withdrawBlockChain();
      res.status(200).send({ status: 200, result });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ status: error.status, error: error.message });
    }
  }
}
const documentController = new DocumentController();
export default documentController;
