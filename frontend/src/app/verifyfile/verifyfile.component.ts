/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-verifyfile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [HttpService],
  templateUrl: './verifyfile.component.html',
  styleUrl: './verifyfile.component.css',
})
export class VerifyfileComponent {
  errorMessage: string = '';
  verifiedFlag: boolean = false;
  responseMessage: string = '';
  success: boolean = false;
  responseClass: string = '';
  selectedOption: string = 'fileHash';

  constructor(
    private httpService: HttpService,
    private contractService: ContractService
  ) {}
  form: any = {
    value: null,
  };

  async onSubmit() {
    const { value } = this.form;
    if (!value) {
      this.verifiedFlag = false;
      this.errorMessage = 'Please Enter the Value';
    } else {
      this.verifiedFlag = false;
      this.httpService.verifyFile(value, this.selectedOption).subscribe({
        next: (data: any) => {
          this.verifiedFlag = true;
          const result = data.result;
          if (result) {
            this.responseClass = 'alert alert-success';
            this.responseMessage = 'VERIFIED ON BLOCKCHAIN';
          } else {
            this.responseClass = 'alert alert-danger';
            this.responseMessage = 'NOT VERIFIED';
          }
        },
        error: (err) => {
          this.errorMessage = 'Something Went Wrong!';
        },
      });

      // const data = await this.contractService.verifyFileBlockChain(value);
      // this.verifiedFlag = true;
      // if (data) {
      //   this.responseMessage = 'VERIFIED ON BLOCKCHAIN';
      // } else {
      //   this.responseMessage = 'NOT VERIFIED';
      // }
    }
  }
}
