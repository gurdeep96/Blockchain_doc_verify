/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  providers: [ContractService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  constructor(private contractService: ContractService) {}
  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  };

  async ngOnInit() {
    const account = await this.contractService.openWallet();
    console.log('ACCOUNTS', account);
  }
}
