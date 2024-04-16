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

  async findByTxHash(txId: string) {
    return await Document.findOne({
      where: { transactionId: txId },
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
        "expiryDate",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async findByHash(hash: string) {
    return await Document.findOne({
      where: { hash: hash },
      attributes: [
        "id",
        "title",
        "documentPath",
        "hash",
        "transactionId",
        "issuer",
        "userId",
        "fileIdentifier",
        "fileSizeMB",
        "expiryDate",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async findDocsByUser(id: number) {
    return await Document.findAndCountAll({
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
        "expiryDate",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async searchDocFilterByUser(id: number, searchTerm: string) {
    return await Document.findAndCountAll({
      where: {
        userId: id,
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("title")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("documentPath")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("hash")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("fileIdentifier")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("issuer")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("expiryDate")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("fileName")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("extension")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("createdAt")),
            "LIKE",
            `%${searchTerm.toLowerCase()}%`
          ),
        ],
      },
      attributes: [
        "title",
        "fileName",
        "documentPath",
        "hash",
        "transactionId",
        "issuer",
        "fileIdentifier",
        "fileSizeMB",
        "expiryDate",
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
      expiryDate: body.expiryDate,
    });
  }

  async updateTxIdByDocId(id: number, txId: string) {
    return await Document.update(
      {
        transactionId: txId,
      },
      {
        where: {
          id: id,
        },
      }
    );
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
