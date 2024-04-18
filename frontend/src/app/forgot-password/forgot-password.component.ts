import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [StorageService, AuthService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  passwordFailed: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';
  id: number = -1;
  form = {
    password: '',
    rpassword: '',
  };
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.token = this.route.snapshot.paramMap.get('token') as string;

    console.log(this.id, this.token);
  }

  onSubmit() {
    const { password, rpassword } = this.form;
    this.passwordFailed = false;
    if (password !== rpassword) {
      this.passwordFailed = true;
      this.errorMessage = 'Password dont match';
    } else {
      this.authService.forgotPassword(this.id, password, this.token).subscribe({
        next: () => {
          this.passwordFailed = false;
          this.successMessage = 'Password Changed!';
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to success route after 2 seconds
          }, 2000);
        },
        error: (error) => {
          console.log('reset error', error);
          this.passwordFailed = true;
          this.errorMessage = error.error.error;
        },
      });
    }
  }
}
