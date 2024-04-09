/* eslint-disable @typescript-eslint/no-explicit-any */

// import { Injectable } from '@angular/core';
// import Web3 from 'web3';
// import Web3Modal from 'web3modal';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ContractService {
//   private web3js: any;
//   private provider: any;
//   private accounts: any;
//   web3Modal;

//   private accountStatusSource = new Subject<any>();
//   accountStatus$ = this.accountStatusSource.asObservable();

//   constructor() {
//     const providerOptions = {
//       walletconnect: {
//         package: WalletConnectProvider,
//         options: {
//           infuraId: '88043fa7582d4423a038d69a3700a542',
//         },
//       },
//     };

//     this.web3Modal = new Web3Modal({
//       network: 'HTTP://127.0.0.1:7545', // optional
//       cacheProvider: true, // optional
//       providerOptions, // required
//       theme: {
//         background: 'rgb(39, 49, 56)',
//         main: 'rgb(199, 199, 199)',
//         secondary: 'rgb(136, 136, 136)',
//         border: 'rgba(195, 195, 195, 0.14)',
//         hover: 'rgb(16, 26, 32)',
//       },
//     });
//   }

//   async connectAccount() {
//     this.web3Modal.clearCachedProvider();

//     this.provider = await this.web3Modal.connect(); // set provider
//     this.web3js = new Web3(this.provider); // create web3 instance
//     this.accounts = await this.web3js.eth.getAccounts();
//     this.accountStatusSource.next(this.accounts);
//   }
// }

import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  window: any;
  constructor() {}
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return -1;
    }
  };

  public openWallet = async () => {
    window.web3 = new Web3(window.ethereum);
    let addresses = await this.getAccounts();
    console.log('service', addresses);
    if (!addresses.length) {
      try {
        addresses = await window.ethereum.send('eth_requestAccounts');
        return addresses[0];
      } catch (e) {
        return false;
      }
    }
    return addresses.length ? addresses[0] : null;
  };
}
