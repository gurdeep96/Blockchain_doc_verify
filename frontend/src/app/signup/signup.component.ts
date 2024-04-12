/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  public responseFlag: boolean = false;
  public responseMessage: string = '';
  public errorMessage: string = '';
  public isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  };

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  submitForm(): void {
    const { firstName, lastName, email, password } = this.form;
    this.errorMessage = '';
    this.authService.register(firstName, lastName, email, password).subscribe({
      next: (data) => {
        this.responseFlag = true;
        if (data.status == 201) {
          this.responseMessage = data.message;
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to success route after 2 seconds
          }, 2000);
        } else {
          console.log('data', data);
          this.responseMessage = data.result;
        }
      },
      error: (error) => {
        console.log('err', error.error.result);
        this.errorMessage = error.error.result;
        this.cdr.detectChanges();
      },
    });
  }
}
