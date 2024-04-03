import db from "../db/models/index";
import Document from "../db/models/document";
export class DocumentRepository {
  async findOne(id: number) {
    return await Document.findOne({ where: { id: id } });
  }

  async findAll() {
    return await Document.findAll();
  }

  async createDocument(P: any, userId: string) {
    return await Document.create({
      title: P.title,
      content: P.content,
      userId: userId ? Number(userId) : null,
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
