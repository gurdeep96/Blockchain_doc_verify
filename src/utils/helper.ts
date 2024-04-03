import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Stream } from "stream";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import * as fs from "fs";

// Define storage for uploaded files
export function multerSingle(fieldName: string) {
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
  return upload.single(fieldName);
}

export function sha256hashSync(buffer: Buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function sha256hashAsync(stream: Stream) {
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

export function encryptFile(
  algorithm: string,
  key: string,
  filePath: string,
  outputPath: string
) {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(16); // Initialization Vector for CBC mode

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(cipher).pipe(output);

    output.on("finish", () => resolve({ iv: iv.toString("hex") }));
    output.on("error", reject);
  });
}
