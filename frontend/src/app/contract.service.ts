/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Web3 from 'web3';
import DocumentVerifyContract from '../smart-contract/DocumentVerify.json';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  web3: any;
  docContract: any;

  walletValue: number = 0;
  private currentAccountSubject = new BehaviorSubject<string | null>(null);

  currentAccount: Observable<string | null> =
    this.currentAccountSubject.asObservable();

  constructor() {}
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return -1;
    }
  };

  web3Instance() {
    if (!this.web3) {
      this.web3 = new Web3(window.ethereum);
    } else {
      return this.web3;
    }
  }

  accountChange(handler: any) {
    return window.ethereum.on('accountsChanged', async () => {
      const account = await this.getAccounts();
      handler(account[0]);
    });
  }

  public openWallet = async () => {
    this.web3Instance();
    let addresses = await this.getAccounts();
    if (!addresses.length) {
      try {
        addresses = await window.ethereum.send('eth_requestAccounts');
        this.currentAccount = addresses[0];
        return addresses[0];
      } catch (e) {
        return false;
      }
    }
    return addresses.length ? addresses[0] : null;
  };

  connectAndSubscribe(): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.web3) {
        this.web3 = new Web3(window.ethereum);
      }

      this.web3.eth.subscribe('getAccounts', (accounts: any[]) => {
        if (accounts.length > 0) {
          this.currentAccountSubject.next(accounts[0]);
        }
      });

      // Subscribe to account changes using your web3 service's method (if available)
      if (this.web3?.eth?.accountsChanged) {
        // Example check
        this.web3.eth.subscribe(
          'accountChanged',
          (err: Error, account: any) => {
            if (!err) this.currentAccountSubject.next(account);
          }
        );
      } else {
        console.warn(
          'Account change subscription not available in this Web3 service.'
        );
      }

      subscriber.next({
        web3: this.web3,
        currentAccount: this.currentAccountSubject.getValue(),
      });

      // Unsubscribe when the component unsubscribes
      return () => this.currentAccountSubject.complete();
    });
  }

  async uploadToBlockChain(data: any, accountAddress: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const web3Client = this.web3Instance();
      const docContract = await this.getDocContract(web3Client);
      const results = await docContract.methods
        .certifyFile(data.fileHash, data.filePath, data.fileIdentifier)
        .send({
          from: accountAddress,
          value: web3Client.utils.toWei('1', 'ether'),
        });

      return results;
    } catch (error) {
      throw error;
    }
  }
  async getDocContract(web3: Web3) {
    if (!this.docContract) {
      const networkIdBigInt = await web3.eth.net.getId();
      const networkId = Number(networkIdBigInt);
      const deployedNetwork = DocumentVerifyContract.networks['5777'];
      const instance = new web3.eth.Contract(
        DocumentVerifyContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.docContract = instance;
    }
    return this.docContract;
  }
}
