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
import logger from "../utils/logger";
import createHttpError, { CreateHttpError } from "http-errors";

export class DocumentService {
  private ipfs: any;
  public constructor() {}

  async findOneDocument(id: number) {
    try {
      const result = await documentRepo.findOne(id);
      logger.info(`Find one document result for ${id} : ${result}`, {
        class: DocumentService.name,
        function: this.findOneDocument.name,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneByPath(path: string) {
    try {
      const result = await documentRepo.findByPath(path);
      logger.info(
        `Find one document result with document path ${path} : ${result}`,
        {
          class: DocumentService.name,
          function: this.findOneByPath.name,
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneByHash(hash: string) {
    try {
      const result = await documentRepo.findByHash(hash);
      logger.info(
        `Find one document result for hash value ${hash} : ${result}`,
        {
          class: DocumentService.name,
          function: this.findOneByHash.name,
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getFilesStorageSize(): Promise<IStorageSum[]> {
    return await documentRepo.findTotalFileStorage();
  }

  async findOneByFileIdentifier(fileIdentifier: string) {
    try {
      const result = await documentRepo.findByFileIdentifier(fileIdentifier);
      logger.info(
        `Find one document result for identifier ${fileIdentifier} : ${result}`,
        {
          class: DocumentService.name,
          function: this.findOneDocument.name,
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findDocumentsByUser(userId: number) {
    try {
      if (!userId) {
        throw new createHttpError.BadRequest("User input required!");
      }
      const user = await userRepo.findOne(userId);
      if (!user) {
        throw new createHttpError.NotFound("User not found!");
      }
      const { count, rows } = await documentRepo.findDocsByUser(userId);

      logger.info(`Count of documents for user id ${userId} is ${count}`, {
        class: DocumentService.name,
        function: this.findDocumentsByUser.name,
      });

      return { username: user.firstName, documents: rows, count: count };
    } catch (error: unknown) {
      logger.error(`Error in find docs by a user ${error}`, {
        class: DocumentService.name,
        function: this.findDocumentsByUser.name,
      });
      throw error;
    }
  }

  async searchDocumentsFilterByUser(userId: number, value: string) {
    try {
      if (!userId || !value) {
        throw new createHttpError.BadRequest("Input needed!");
      }
      const user = await userRepo.findOne(userId);
      if (!user) {
        throw new createHttpError.NotFound("User not found!");
      }
      const { count, rows } = await documentRepo.searchDocFilterByUser(
        userId,
        value
      );

      logger.info(
        `Count of documents for user id ${userId} with search Term '${value}' is ${count}`,
        {
          class: DocumentService.name,
          function: this.searchDocumentsFilterByUser.name,
        }
      );

      return { count, response: rows };
    } catch (error) {
      logger.error(`Error in filter docs by a user ${error}`, {
        class: DocumentService.name,
        function: this.searchDocumentsFilterByUser.name,
      });
      throw error;
    }
  }

  async findUserByDocument(path: string) {
    try {
      if (!path) {
        throw new createHttpError.BadRequest("Path is required!");
      }
      const document = await documentRepo.findUserByDoc(path);
      if (!document) {
        throw new createHttpError.NotFound(
          "Document not found for given User!"
        );
      }

      logger.info(`Document found ${document}`, {
        class: DocumentService.name,
        function: this.findUserByDocument.name,
      });

      return document;
    } catch (error) {
      logger.error(`Error in filter docs by a user ${error}`, {
        class: DocumentService.name,
        function: this.findUserByDocument.name,
      });

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
    try {
      if (!id || !txId) {
        throw new createHttpError.BadRequest("Invalid input data");
      }
      logger.info(
        `Document Trasaction Hash ${txId} update called for Document Id ${id}`,
        {
          class: DocumentService.name,
          function: this.updateTxIdByDocId.name,
        }
      );

      return await documentRepo.updateTxIdByDocId(id, txId);
    } catch (error) {
      logger.error(`Error in filter docs by a user ${error}`, {
        class: DocumentService.name,
        function: this.updateTxIdByDocId.name,
      });
      throw error;
    }
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

  async getFile(docId: string) {
    try {
      if (!docId) {
        throw new createHttpError.BadRequest("No Hash for File Passed!");
      }

      const doc = await documentRepo.findByPath(docId);
      if (!doc) {
        throw new createHttpError.NotFound(
          `Document with path CID id ${docId} not Found`
        );
      }

      const response = await fetch(
        `https://cloudflare-ipfs.com/ipfs/${docId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new createHttpError.NotFound(
          `File not found on IPFS for hash ${docId}`
        );
      }
      const res = await documentService.findOneByPath(docId);
      const contentType = res?.mimeType as string;

      logger.info(
        `Returning Decrypted file with path Cid ${docId} from IPFS storage`,
        {
          class: DocumentService.name,
          function: this.getFile.name,
        }
      );

      return { contentType, response };
    } catch (error) {
      logger.error(`Error in fetching ${docId} file from IPFS : ${error}`, {
        class: DocumentService.name,
        function: this.getFile.name,
      });
      throw error;
    }
  }

  async fileUploadIpfs(
    userId: number,
    file: Express.Multer.File | undefined,
    body: any
  ) {
    try {
      if (!userId) {
        throw new createHttpError.BadRequest("user id is missing!");
      }
      if (!file) {
        throw new createHttpError.BadRequest("Uploaded File is Required!");
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
        if (hashDB.transactionId) {
          throw new createHttpError.BadRequest("Document Already Present!");
        } else if (hashDB.userId == userId) {
          logger.info(
            `Already peresent Document in Db with no transaction Hash , so retrying`,
            {
              class: DocumentService.name,
              function: this.fileUploadIpfs.name,
            }
          );
          return hashDB;
        } else {
          throw new createHttpError.BadRequest(
            "Document Already Present and with a different User Id!"
          );
        }
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
      if (body.expiryDate != null) {
        create.expiryDate = new Date(body.expiryDate);
        console.log(create.expiryDate);
      }

      const result = await documentRepo.createDocument(create, userId);

      logger.info(
        `Successfully uploaded new Document for user id ${userId} with sha hash ${create.hashed}`,
        {
          class: DocumentService.name,
          function: this.fileUploadIpfs.name,
        }
      );
      return result;
    } catch (error) {
      logger.error(
        `Error in uploading file for user with id ${userId} : ${error}`,
        {
          class: DocumentService.name,
          function: this.fileUploadIpfs.name,
        }
      );
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

      logger.info(
        `Successfully uploaded new Document for user id ${userId} with sha hash ${create.hashed}`,
        {
          class: DocumentService.name,
          function: this.fileUploadIpfs.name,
        }
      );

      return result;
    } catch (error) {
      logger.error(
        `Error in uploading file for user with id ${userId} : ${error}`,
        {
          class: DocumentService.name,
          function: this.fileUpload.name,
        }
      );
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
      if (!value) {
        throw new createHttpError.BadRequest("No Value provided!");
      }
      const web3Client = await web3Service.getWeb3Client();
      const docContract = await web3Service.getDocContract(web3Client);
      let results = false;
      let expiryDate;
      if (option == "transactionHash") {
        const res = await documentRepo.findByTxHash(value);
        if (res?.hash) {
          expiryDate = res.expiryDate;
          results = await docContract.methods.verifyFileHash(res.hash).call();
        }
      } else if (option == "fileIdentifier") {
        const res = await documentRepo.findByFileIdentifier(value);
        if (res?.hash) {
          expiryDate = res.expiryDate;
          results = await docContract.methods.verifyFileHash(res.hash).call();
        }
      } else {
        const res = await documentRepo.findByHash(value);
        expiryDate = res?.expiryDate;
        results = await docContract.methods.verifyFileHash(value).call();
      }

      logger.info(
        `Result for Verifying document presence in blockchain for ${value} is : ${results}`,
        {
          class: DocumentService.name,
          function: this.verifyFileBlockChain.name,
        }
      );

      return { results, expiryDate };
    } catch (error) {
      logger.error(
        `Error in verifying document ${value} on Blockchain network : ${error}`,
        {
          class: DocumentService.name,
          function: this.verifyFileBlockChain.name,
        }
      );
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

      logger.info(
        `Successfully Withdrawn currency fom contract to owner's account`,
        {
          class: DocumentService.name,
          function: this.withdrawBlockChain.name,
        }
      );

      return results?.transactionHash;
    } catch (error) {
      logger.error(`Error in Withdrawing tokens into owner's account`, {
        class: DocumentService.name,
        function: this.withdrawBlockChain.name,
      });
      throw error;
    }
  }
}
const documentService = new DocumentService();
export default documentService;
