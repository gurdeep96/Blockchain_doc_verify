import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Stream } from "stream";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import * as fs from "fs";
import * as fsPromise from "fs/promises";
import nodemailer from "nodemailer";

export function multerClient() {
  const paths = "../document/";
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, paths)); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Rename the file to include the timestamp
    },
  });

  // Initialize Multer with the storage configuration
  const upload = multer({ storage: storage });
  return upload;
}

export function sha256hashSync(buffer: Buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function sha256hashAsync(stream: Stream): Promise<string> {
  return await new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");

    hash.once("finish", () => resolve(hash.read().toString("hex")));
    stream.once("error", (err: Error) => reject(err));

    stream.pipe(hash);
  });
}

export async function infuraIpfsCreate(): Promise<IPFSHTTPClient> {
  const token = `${process.env.INFURA_CLIENTID}:${process.env.INFURA_SECRETKEY}`;
  const infuraToken = Buffer.from(token).toString("base64");
  const ipfs = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: `Basic ${infuraToken}`,
    },
  });
  return ipfs;
}

export async function infuraIpfsSave(
  ipfs: IPFSHTTPClient,
  fileName: string,
  file: any
) {
  const result = await ipfs.add({
    path: fileName,
    content: JSON.stringify(file),
  });
  return result;
}

export async function thirdwebIpfsCreate() {
  const ipfsStorage = new ThirdwebStorage({
    secretKey: process.env.THIRD_WEB_SECRETKEY,
  });

  return ipfsStorage;
}

export async function thirdwebIpfsUpload(ipfs: ThirdwebStorage, file: any) {
  const result = await ipfs.upload(file);
  return result;
}

export async function thirdwebIpfsDownload(ipfs: ThirdwebStorage, uri: string) {
  const result = await ipfs.download(uri);
  return result;
}

export async function encryptFile(
  algorithm: string,
  key: any,
  fileInputStream: Stream,
  fileName: string
) {
  return new Promise((resolve, reject) => {
    const iv = Buffer.from(process.env.ENCRY_IV as string, "hex");
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const output = fs.createWriteStream(
      path.join(__dirname, `../document/enc/${fileName}`)
    );

    fileInputStream.pipe(cipher).pipe(output);

    output.on("finish", () => resolve(output.path));
    output.on("error", reject);
  });
}

export function decryptBuffer(algorithm: string, key: any, encryptedData: any) {
  const iv = Buffer.from(process.env.ENCRY_IV as string, "hex");
  let encryptedTextBuffer = Buffer.from(encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // Decrypt the buffer
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}

export function decryptBuffers(
  algorithm: string,
  key: any,
  buffer: Buffer
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const iv = Buffer.from(process.env.ENCRY_IV as string, "hex");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    // Decrypt the buffer
    let decrypted = Buffer.from([]);
    decipher.on("data", (chunk) => {
      decrypted = Buffer.concat([decrypted, chunk]);
    });

    decipher.on("end", () => {
      resolve(decrypted);
    });

    decipher.on("error", (error) => {
      reject(error);
    });

    decipher.write(buffer);
    decipher.end();
  });
}

export function decrypt(algorithm: string, key: any, encrypted: any) {
  const iv = encrypted.slice(0, 16);
  encrypted = encrypted.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
}

export async function ipfsUploadEncryptedFile(
  ipfs: any,
  algorithm: string,
  key: string,
  filePath: string,
  fileName: string
) {
  try {
    const fsInputStreams = fs.createReadStream(filePath);
    const outPath = await encryptFile(algorithm, key, fsInputStreams, fileName);
    const readFileEnc = await fsPromise.readFile(outPath as string);
    const fileSave = await thirdwebIpfsUpload(ipfs, readFileEnc);

    await fsPromise.unlink(filePath);
    await fsPromise.unlink(outPath as string);

    return fileSave;
  } catch (error) {
    throw error;
  }
}

export function keyGen(key: string) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(key, "salt", 32, (error, keys) => {
      if (error) {
        reject(error);
      } else {
        resolve(keys);
      }
    });
  });
}

function mailer() {
  let transporter: any;

  function createTransporter() {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVICE,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  return {
    getTransporter: function () {
      if (!transporter) {
        console.log("Creating new transporter...");
        createTransporter();
      }
      return transporter;
    },
  };
}

function email() {
  return mailer().getTransporter();
}

export function sendEmail(to: string, subject: string, text: any) {
  return new Promise((resolve, reject) => {
    var mailOptions = {
      from: process.env.MAIL_ID,
      to: to,
      subject: subject,
      html: text,
    };

    const mailer = email();
    mailer.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        reject(error);
      } else {
        resolve("Email Sent Succesfully!");
      }
    });
  });
}

export function randomGen() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
