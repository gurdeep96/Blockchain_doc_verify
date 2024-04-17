import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [StorageService, AuthService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  isLoggedIn: boolean = false;
  responseMessage: string = '';
  form = {
    email: '',
  };
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    const { email } = this.form;
    this.responseMessage = '';
    this.authService.forgotPassword(email).subscribe((data) => {
      if (data.status == 200) {
        this.responseMessage = 'Check Your Email';
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to success route after 2 seconds
        }, 2000);
      } else {
        console.log('data', data);
        this.responseMessage = data.result;
      }
    });
  }
}
