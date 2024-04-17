/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractService } from '../contract.service';
import { format } from 'path';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-verifyfile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [HttpService, DatePipe],
  templateUrl: './verifyfile.component.html',
  styleUrl: './verifyfile.component.css',
})
export class VerifyfileComponent {
  errorMessage: string = '';
  verifiedFlag: boolean = false;
  responseMessage: string = '';
  success: boolean = false;
  responseClass: string = '';
  expClass: string = '';
  selectedOption: string = 'fileHash';
  expiryDate: any;
  showExp: boolean = false;

  constructor(
    private httpService: HttpService,
    private contractService: ContractService,
    private datePipe: DatePipe
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
      this.showExp = false;
      this.httpService.verifyFile(value, this.selectedOption).subscribe({
        next: (data: any) => {
          this.verifiedFlag = true;
          const result = data.result;
          if (
            typeof new Date(data.expiryDate) === 'object' &&
            !isNaN(new Date(data.expiryDate).getTime())
          ) {
            this.showExp = true;
            if (this.compareDates(new Date(), new Date(data.expiryDate)))
              this.expClass = 'alert alert-success';
            else this.expClass = 'alert alert-danger';

            this.expiryDate = this.datePipe.transform(
              data.expiryDate,
              'dd/MM/yyyy'
            );
          }

          console.log(
            typeof new Date(this.expiryDate),
            new Date(this.expiryDate),
            data.expiryDate
          );

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

  compareDates(currentDate: Date, dateToCompare: Date): boolean {
    // Convert both dates to UTC for accurate comparison
    const todayUTC = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const dateToCompareUTC = Date.UTC(
      dateToCompare.getFullYear(),
      dateToCompare.getMonth(),
      dateToCompare.getDate()
    );

    // Compare the dates using less than (<) or greater than (>) operators
    return todayUTC < dateToCompareUTC; // For less than comparison
    // return todayUTC > dateToCompareUTC; // For greater than comparison
  }
}
