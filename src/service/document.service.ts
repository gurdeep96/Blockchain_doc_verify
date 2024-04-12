import { IStorageSum } from "../interface/user.interface";
import documentRepo, {
  DocumentRepository,
} from "../repository/document.repository";
import userRepo, { UserRepository } from "../repository/user.repository";
import {
  ipfsUploadEncryptedFile,
  keyGen,
  sha256hashAsync,
  thirdwebIpfsCreate,
  thirdwebIpfsUpload,
} from "../utils/helper";
import * as fs from "fs";
import web3Service from "../utils/web3";
import * as fsPromise from "fs/promises";

export class DocumentService {
  private ipfs: any;
  public constructor() {}

  async findOneDocument(id: number) {
    return await documentRepo.findOne(id);
  }

  async findOneByPath(path: string) {
    return await documentRepo.findByPath(path);
  }

  async findOneByHash(hash: string) {
    return await documentRepo.findByHash(hash);
  }

  async getFilesStorageSize(): Promise<IStorageSum[]> {
    return await documentRepo.findTotalFileStorage();
  }

  async findOneByFileIdentifier(fileIdentifier: string) {
    return await documentRepo.findByFileIdentifier(fileIdentifier);
  }

  async findDocumentsByUser(userId: number) {
    try {
      const user = await userRepo.findOne(userId);
      if (!user) {
        throw new Error("User not found!");
      }
      const { count, rows } = await documentRepo.findDocsByUser(userId);
      return { username: user.firstName, documents: rows, count: count };
    } catch (error) {
      throw error;
    }
  }

  async searchDocumentsFilterByUser(userId: number, value: string) {
    try {
      const user = await userRepo.findOne(userId);
      if (!user) {
        throw new Error("User not found!");
      }
      const { count, rows } = await documentRepo.searchDocFilterByUser(
        userId,
        value
      );
      return { count, response: rows };
    } catch (error) {
      throw error;
    }
  }

  async findUserByDocument(path: string) {
    try {
      const document = await documentRepo.findUserByDoc(path);
      if (!document) {
        throw new Error("Document not found for given User!");
      }
      return document;
    } catch (error) {
      throw error;
    }
  }

  async findAllDocument() {
    return await documentRepo.findAll();
  }

  async createDocument(Document: any, userId: string) {
    return await documentRepo.createDocument(Document, Number(userId));
  }

  async updateTxIdByDocId(id: number, txId: string) {
    return await documentRepo.updateTxIdByDocId(id, txId);
  }

  async updateDocument(id: number, Document: any) {
    const createOne = {
      firstName: Document.firstname,
      lastName: Document.lastname,
      email: Document.email,
    };
    return await documentRepo.updateDocument(id, createOne);
  }

  async deleteDocument(id: number) {
    return await documentRepo.deleteDocument(id);
  }

  async assignDocument(DocumentId: string, userId: string) {
    const Document = await documentRepo.findOne(Number(DocumentId));
    if (!Document) {
      throw new Error("Document doesnt exists!");
    }
    if (Document.userId !== null) {
      throw new Error("Already assigned Document");
    }
    return await documentRepo.assignDocument(
      Number(DocumentId),
      Number(userId)
    );
  }

  async unassignDocument(DocumentId: string, userId: string) {
    const Document = await documentRepo.findOne(Number(DocumentId));
    if (!Document) {
      throw new Error("Document doesnt exists!");
    }
    if (Document.userId == null) {
      throw new Error("Already unassigned Document");
    }
    return await documentRepo.unassignDocument(
      Number(DocumentId),
      Number(userId)
    );
  }

  async getFile(docId: string) {
    try {
      const doc = await documentRepo.findByPath(docId);
      if (!doc) {
        throw new Error("Document not Found");
      }

      const response = await fetch(
        `https://cloudflare-ipfs.com/ipfs/${docId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`File not found on IPFS for hash`);
      }
      const res = await documentService.findOneByPath(docId);
      const contentType = res?.mimeType as string;
      return { contentType, response };
    } catch (error) {
      throw error;
    }
  }

  async fileUploadIpfs(
    userId: number,
    file: Express.Multer.File | undefined,
    body: any
  ) {
    try {
      if (!file) {
        throw new Error("File is Required!");
      }
      if (!this.ipfs) {
        this.ipfs = await thirdwebIpfsCreate();
      }
      const fileSizeMB = file.size / 10 ** 6;
      const mimeType = file.mimetype;
      const fsInputStream = fs.createReadStream(file.path);
      const hashed = await sha256hashAsync(fsInputStream);

      const hashDB = await this.findOneByHash(hashed);

      if (hashDB) {
        throw new Error("File Already Present!");
      }
      const keys = await keyGen(process.env.ENCRY_KEY as string);
      const fileSave = await ipfsUploadEncryptedFile(
        this.ipfs,
        process.env.ENCRY_ALGO as string,
        keys as string,
        file.path,
        file.filename
      );

      const filePath = fileSave.split("//")[1];
      const extension = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
      const { title, issuer, identifierId } = body;
      const create = {} as { [key: string]: any };
      create.title = title;
      create.filePath = filePath;
      create.hash = hashed;
      create.issuer = issuer;
      create.fileSizeMB = fileSizeMB;
      create.extension = extension;
      create.fileIdentifier = identifierId;
      create.mimeType = mimeType;
      create.fileName = file?.originalname;

      const result = await documentRepo.createDocument(create, userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async fileUpload(
    userId: number,
    file: Express.Multer.File | undefined,
    body: any
  ) {
    try {
      if (!file) {
        throw new Error("File is Required!");
      }
      if (!this.ipfs) {
        this.ipfs = await thirdwebIpfsCreate();
      }
      const fileSizeMB = file.size / 10 ** 6;
      const mimeType = file.mimetype;
      const fsInputStream = fs.createReadStream(file.path);
      const hashed = await sha256hashAsync(fsInputStream);

      const hashDB = await this.findOneByHash(hashed);

      if (hashDB) {
        throw new Error("File Already Present!");
      }
      const keys = await keyGen(process.env.ENCRY_KEY as string);
      const fileSave = await ipfsUploadEncryptedFile(
        this.ipfs,
        process.env.ENCRY_ALGO as string,
        keys as string,
        file.path,
        file.filename
      );

      const filePath = fileSave.split("//")[1];
      const extension = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
      const { title, issuer, identifierId } = body;
      const create = {} as { [key: string]: any };
      create.title = title;
      create.filePath = filePath;
      create.hash = hashed;
      create.issuer = issuer;
      create.fileSizeMB = fileSizeMB;
      create.extension = extension;
      create.fileIdentifier = identifierId;
      create.mimeType = mimeType;
      create.fileName = file?.originalname;

      const accountAddress = body.accountAddress;

      const blockChainResult = await this.uploadToBlockChain(
        {
          fileHash: hashed,
          filePath: filePath,
          fileIdentifier: identifierId,
        },
        accountAddress
      );

      if (blockChainResult.transactionHash)
        create.transactionId = blockChainResult.transactionHash;
      console.log("TX BLOCKCHAIN", blockChainResult);

      const result = await documentRepo.createDocument(create, userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async uploadToBlockChain(data: any, accountAddress: string) {
    try {
      const web3Client = await web3Service.getWeb3Client();
      const docContract = await web3Service.getDocContract(web3Client);
      const results = await docContract.methods
        .certifyFile(data.fileHash, data.filePath, data.fileIdentifier)
        .send({
          from: accountAddress,
          value: web3Client.utils.toWei("1", "ether"),
        });

      return results;
    } catch (error) {
      throw error;
    }
  }

  async verifyFileBlockChain(value: string, option: string) {
    try {
      const web3Client = await web3Service.getWeb3Client();
      const docContract = await web3Service.getDocContract(web3Client);
      let results = false;
      if (option == "transactionHash") {
        const res = await documentRepo.findByTxHash(value);
        if (res?.hash) {
          console.log("trasnaction hash", res.hash);
          results = await docContract.methods.verifyFileHash(res.hash).call();
        }
      } else if (option == "fileIdentifier") {
        const res = await documentRepo.findByFileIdentifier(value);
        if (res?.hash) {
          console.log("file iden", res.hash);
          results = await docContract.methods.verifyFileHash(res.hash).call();
        }
      } else {
        results = await docContract.methods.verifyFileHash(value).call();
      }
      console.log("verify call result contract", results);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async withdrawBlockChain() {
    try {
      const web3Client = await web3Service.getWeb3Client();
      const docContract = await web3Service.getDocContract(web3Client);

      const results = await docContract.methods
        .withdraw()
        .send({ from: process.env.OWNER_ACCOUNT_ADDRESS });

      console.log("withdraw result contract", results);
      return results?.transactionHash;
    } catch (error) {
      throw error;
    }
  }
}
const documentService = new DocumentService();
export default documentService;
