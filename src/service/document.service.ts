import { DocumentRepository } from "../repository/document.repo";

export class DocumentService {
  private DocumentRepo: DocumentRepository;
  public constructor() {
    this.DocumentRepo = new DocumentRepository();
  }

  async findOneDocument(id: number) {
    return await this.DocumentRepo.findOne(id);
  }

  async findAllDocument() {
    return await this.DocumentRepo.findAll();
  }

  async createDocument(Document: any, userId: string) {
    //console.log("tags", tagIds, tags);
    return await this.DocumentRepo.createDocument(Document, userId);
  }

  async updateDocument(id: number, Document: any) {
    const createOne = {
      firstName: Document.firstname,
      lastName: Document.lastname,
      email: Document.email,
    };
    return await this.DocumentRepo.updateDocument(id, createOne);
  }

  async deleteDocument(id: number) {
    return await this.DocumentRepo.deleteDocument(id);
  }

  async assignDocument(DocumentId: string, userId: string) {
    const Document = await this.DocumentRepo.findOne(Number(DocumentId));
    if (!Document) {
      throw new Error("Document doesnt exists!");
    }
    if (Document.userId !== null) {
      throw new Error("Already assigned Document");
    }
    return await this.DocumentRepo.assignDocument(
      Number(DocumentId),
      Number(userId)
    );
  }

  async unassignDocument(DocumentId: string, userId: string) {
    const Document = await this.DocumentRepo.findOne(Number(DocumentId));
    if (!Document) {
      throw new Error("Document doesnt exists!");
    }
    if (Document.userId == null) {
      throw new Error("Already unassigned Document");
    }
    return await this.DocumentRepo.unassignDocument(
      Number(DocumentId),
      Number(userId)
    );
  }
}
const documentService = new DocumentService();
export default documentService;
