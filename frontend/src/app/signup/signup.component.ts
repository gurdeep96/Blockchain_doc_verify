/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  public responseFlag: boolean = false;
  public responseMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  formData: any = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  };

  submitForm(): void {
    const { firstName, lastName, email, password } = this.formData;
    this.authService.register(firstName, lastName, email, password).subscribe({
      next: (data) => {
        this.responseFlag = true;
        if (data.code == 201) {
          this.responseMessage = data.message;
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to success route after 2 seconds
          }, 2000);
        } else {
          this.responseMessage = data.result;
        }
      },
      error: () => {
        this.responseMessage = 'Signup Failed';
      },
    });
  }
}
