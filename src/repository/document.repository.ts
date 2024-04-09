import db from "../db/models/index";
import Document from "../db/models/document";
import User from "../db/models/user";
import { Op, Sequelize } from "sequelize";
import { IStorageSum } from "../interface/user.interface";

export class DocumentRepository {
  async findOne(id: number) {
    return await Document.findOne({ where: { id: id } });
  }

  async findUserByDoc(path: string) {
    return await Document.findOne({
      where: { documentPath: path },
    });
  }

  async findByFileIdentifier(fileIdentifier: string) {
    return await Document.findOne({
      where: { fileIdentifier: fileIdentifier },
    });
  }

  async findTotalFileStorage(): Promise<IStorageSum[]> {
    return await Document.aggregate("fileSizeMB", "SUM", {
      plain: false,
      raw: true,
    });
  }

  async findByPath(path: string) {
    return await Document.findOne({
      where: { documentPath: path },
      attributes: [
        "title",
        "documentPath",
        "hash",
        "issuer",
        "fileIdentifier",
        "fileSizeMB",
        "mimeType",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async findByHash(hash: string) {
    return await Document.findOne({
      where: { hash: hash },
      attributes: [
        "title",
        "documentPath",
        "hash",
        "issuer",
        "fileIdentifier",
        "fileSizeMB",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async findDocsByUser(id: number) {
    return await Document.findAll({
      where: { userId: id },
      attributes: [
        "title",
        "fileName",
        "documentPath",
        "hash",
        "transactionId",
        "issuer",
        "fileIdentifier",
        "fileSizeMB",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async findAll() {
    return await Document.findAll({
      include: {
        model: User,
        attributes: ["firstName", "lastName", "email"],
        where: { active: true },
      },
    });
  }

  async createDocument(body: any, userId: number) {
    return await Document.create({
      title: body.title,
      documentPath: body.filePath,
      hash: body.hash,
      userId: userId,
      issuer: body.issuer ? body.issuer : "",
      transactionId: body.transactionId ? body.transactionId : "",
      fileName: body.fileName ? body.fileName : `file-${Date.now()}`,
      fileSizeMB: body.fileSizeMB,
      extension: body.extension,
      fileIdentifier: body.fileIdentifier,
      mimeType: body.mimeType,
    });
  }

  async updateDocument(id: number, P: any) {
    return await Document.update(
      {
        title: P.title,
        content: P.content,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async assignDocument(DocumentId: number, userId: number) {
    return await Document.update(
      {
        userId: userId,
      },
      {
        where: {
          id: DocumentId,
        },
      }
    );
  }
  async unassignDocument(DocumentId: number, userId: number) {
    return await Document.update(
      {
        userId: null,
      },
      {
        where: {
          id: DocumentId,
        },
      }
    );
  }
  async deleteDocument(id: number) {
    return await Document.destroy({
      where: {
        id: id,
      },
    });
  }
}
const documentRepository = new DocumentRepository();
export default documentRepository;
