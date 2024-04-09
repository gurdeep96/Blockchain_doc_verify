import Web3, { Web3EthInterface } from "web3";
import DocumentVerifyArtifact from "../smart-contract/build/contracts/DocumentVerify.json";

export class Web3Service {
  private web3: Web3 | undefined;
  private docContract: any;
  constructor() {}

  async getWeb3Client() {
    if (!this.web3) {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_URL as string)
      );
    }
    return this.web3;
  }

  async getDocContract(w3: Web3) {
    if (!this.docContract) {
      const networkIdBigInt = await w3.eth.net.getId();
      const networkId = networkIdBigInt.toString();
      const docContract = new w3.eth.Contract(
        DocumentVerifyArtifact.abi,
        //DocumentVerifyArtifact.networks[5777].address
        process.env.CONTRACT_ADDRESS
      );
      this.docContract = docContract;
    }
    return this.docContract;
  }
}

const web3Service = new Web3Service();
export default web3Service;
