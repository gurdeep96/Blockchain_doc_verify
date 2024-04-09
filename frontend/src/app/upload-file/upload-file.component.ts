/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../storage.service';
import { jwtDecode } from 'jwt-decode';
import { ContractService } from '../contract.service';

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
export class UploadFileComponent implements OnInit {
  public uploadResponse: any;
  public responseFlag = false;
  public uploadFlag: boolean = false;
  public wallet: any;
  public enableUpload: boolean = false;
  public errorWallet: string = '';

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private contractService: ContractService
  ) {}
  formData = {
    title: '',
    identifierId: '',
    userId: '',
    userEmail: '',
    file: null as File | null, // Used to hold the selected file
  };

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    const email = this.route.snapshot.paramMap.get('email');
    if (userId) {
      this.formData.userId = userId as string;
    }
    if (email) {
      this.formData.userEmail = email as string;
    }
    if (!userId && !email) {
      const bearerToken = this.storageService.getToken();
      const decoded: DecodedToken = jwtDecode(bearerToken);
      const { userId, email } = decoded;
      this.formData.userId = String(userId);
      this.formData.userEmail = email as string;
    }
    this.getWallet();
  }

  onFileSelected(event: any) {
    this.formData.file = event.target.files[0] as File;
  }

  async getWallet() {
    try {
      const address = await this.contractService.openWallet();
      if (address) {
        this.wallet = address;
        this.enableUpload = true;
        console.log('Wallet ADDRESS', this.wallet);
      } else {
        throw new Error();
      }
    } catch (error) {
      this.enableUpload = false;
      this.errorWallet = 'Kindly Enable a Wallet extension to Upload Documents';
    }
  }

  submitForm() {
    const form = new FormData();
    form.append('title', this.formData.title);
    form.append('identifierId', this.formData.identifierId);
    form.append('file', this.formData.file as File);
    form.append('accountAddress', this.wallet);
    this.httpService
      .uploadFile(form, this.formData.userId)
      .subscribe((data) => {
        console.log('API res', data);
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
          this.uploadResponse = 'Error Uploading File';
          this.uploadFlag = false;
          console.log('error msg', this.uploadResponse);
        }
      });
  }
}
