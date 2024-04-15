/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { jwtDecode } from 'jwt-decode';
import { ContractService } from '../contract.service';
import { Subscription } from 'rxjs';

interface ApiResponse {
  result: any;
  status: number;
}

interface DecodedToken {
  userId: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [HttpService, ContractService],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css',
})
export class UploadFileComponent implements OnInit, OnDestroy {
  public uploadResponse: any;
  public responseFlag: boolean = false;
  public uploadFlag: boolean = false;
  public wallet: any;
  public enableUpload: boolean = false;
  public errorWallet: string = '';
  public errorResponse: string = '';
  public userFlag: boolean = false;
  public userId: number = -1;
  public email: string = '';
  accountSubscription: Subscription | undefined;
  walletBalance: number = 0;
  web3: any;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef
  ) {}
  formData = {
    title: '',
    identifierId: '',
    userId: '',
    userEmail: '',
    file: null as File | null, // Used to hold the selected file
  };

  async ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.email = this.route.snapshot.paramMap.get('email') as string;
    //const userId = this.storageService.getUploadUserId();
    //const email = this.storageService.getUploadUserEmail();
    // this.storageService.userData.subscribe((userData) => {
    //   console.log('user', userData);
    //   if (userData) {
    //     this.userId = userData.id;
    //     this.email = userData.email;
    //   }
    // });
    console.log(this.userId, this.email);
    if (this.userId) {
      this.formData.userId = String(this.userId);
    }
    if (this.email) {
      this.formData.userEmail = this.email;
    }
    const bearerToken = this.storageService.getToken();
    const decoded: DecodedToken = jwtDecode(bearerToken);
    const { role } = decoded;
    if (this.userId == -1 && !this.email) {
      const { userId, email } = decoded;
      this.formData.userId = String(userId);
      this.formData.userEmail = email as string;
    }
    if (role == 'user') {
      alert('You do not have Upload Access!');

      this.router.navigate(['/dashboard']);
    }
    await this.getWallet();
    // this.contractService.connectAndSubscribe().subscribe(async (state: any) => {
    //   this.web3 = state.web3;
    //   this.wallet = state.currentAccount;
    //   if (this.web3) {
    //     await this.getWalletValue(this.wallet);
    //   }
    //   console.log(this.web3, this.wallet, this.walletBalance);
    // });

    await this.changeDetect();
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  setWallet(account: string) {
    this.wallet = account;
    this.cdr.detectChanges();
  }

  async changeDetect() {
    this.contractService.accountChange(async (account: string) => {
      this.setWallet(account);
      await this.getWalletValue(account);
    });
  }

  onFileSelecteds(event: any) {
    this.formData.file = event.target.files[0] as File;
  }

  async getWalletValue(account: string) {
    const balance = await this.web3.eth.getBalance(account);
    // Convert balance to desired format (e.g., Ether, USD)
    this.walletBalance = await this.web3.utils.fromWei(balance, 'ether');
    this.cdr.detectChanges();
  }

  async getWallet() {
    try {
      const address = await this.contractService.openWallet();
      this.web3 = await this.contractService.web3Instance();
      if (address) {
        this.wallet = address;
        await this.getWalletValue(address);
        this.enableUpload = true;
      } else {
        throw new Error();
      }
    } catch (error) {
      this.enableUpload = false;
      this.errorWallet = 'Kindly Enable a Wallet extension to Upload Documents';
    }
  }

  submit() {
    const form = new FormData();
    this.responseFlag = false;
    form.append('title', this.formData.title);
    form.append('identifierId', this.formData.identifierId);
    form.append('file', this.formData.file as File);
    this.httpService.uploadFileIpfs(form, this.formData.userId).subscribe({
      next: async (data) => {
        const res = data as ApiResponse;
        this.responseFlag = true;
        if (res.status == 201) {
          const response = res.result;
          const inputData = {
            fileHash: response.hash,
            filePath: response.documentPath,
            fileIdentifier: response.fileIdentifier,
          };

          // const blockTransact = await this.contractService.uploadToBlockChain(
          //   inputData,
          //   this.wallet
          // );
          // response.transactionId = blockTransact?.transactionHash;
          // this.uploadResponse = response;

          const docContract = await this.contractService.getDocContract(
            this.web3
          );
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const self = this;
          docContract.methods
            .certifyFile(
              inputData.fileHash,
              inputData.filePath,
              inputData.fileIdentifier
            )
            .send({
              from: this.wallet,
              value: this.web3.utils.toWei('1', 'ether'),
            })
            .on('receipt', function (receipt: any) {
              // Transaction was accepted into the blockchain, let's redraw the UI
              self.uploadFlag = true;
              response.transactionId = receipt.transactionHash;
              self.httpService
                .updateFileTransactionHash(response.id, receipt.transactionHash)
                .subscribe({
                  next: () => {
                    self.uploadResponse = response;
                    self.cdr.detectChanges();
                    console.log('receipt', self.uploadResponse);
                  },
                  error: () => {},
                });
            })
            .on('error', function (error: any) {
              // Do something to alert the user their transaction has failed
              console.log('failed wallet tx', error);
              self.uploadFlag = false;
              self.errorResponse = 'Document could not be added to Blockchain';
              self.cdr.detectChanges();
            });

          // this.formData = {
          //   title: '',
          //   identifierId: '',
          //   userId: '',
          //   userEmail: '',
          //   file: null as File | null,
          // };
        } else {
          this.uploadFlag = false;
          this.uploadResponse = res.result;
          console.log('error msg', this.uploadResponse);
        }
      },
      error: (error) => {
        this.responseFlag = true;
        this.uploadFlag = false;
        if (error?.error?.result) {
          this.errorResponse = error.error.result;
        } else {
          this.errorResponse = error.error.error;
        }
        this.cdr.detectChanges();
      },
    });
  }

  submitForm() {
    const form = new FormData();

    form.append('title', this.formData.title);
    form.append('identifierId', this.formData.identifierId);
    form.append('file', this.formData.file as File);
    form.append('accountAddress', this.wallet);
    this.httpService.uploadFile(form, this.formData.userId).subscribe({
      next: (data) => {
        const res = data as ApiResponse;
        this.responseFlag = true;
        if (res.status == 201) {
          this.uploadResponse = res.result;
          this.uploadFlag = true;
          this.formData = {
            title: '',
            identifierId: '',
            userId: '',
            userEmail: '',
            file: null as File | null,
          };
        } else {
          this.uploadFlag = false;
          this.uploadResponse = 'Error Uploading File';
          console.log('error msg', this.uploadResponse);
        }
      },
      error: () => {
        this.uploadFlag = false;
        this.uploadResponse = 'Operation Failed!';
      },
    });
  }
}
