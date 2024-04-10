/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  constructor(private httpService: HttpService) {}
  form: any = {
    value: null,
  };

  onSubmit() {
    const { value } = this.form;
    if (!value) {
      this.verifiedFlag = false;
      this.errorMessage = 'Please Enter the Value';
    } else {
      this.httpService.verifyFile(value).subscribe({
        next: (data: any) => {
          this.verifiedFlag = true;
          if (data.code == 200) {
            const result = data.result;
            if (result) {
              this.responseMessage = 'VERIFIED ON BLOCKCHAIN';
            } else {
              this.responseMessage = 'NOT VERIFIED';
            }
          }
        },
        error: (err) => {
          this.errorMessage = 'Something Went Wrong!';
        },
      });
    }
  }
}
