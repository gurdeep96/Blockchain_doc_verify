/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AuthService, StorageService, LayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  title = 'login';
  form: any = {
    email: null,
    password: null,
  };
  form2: any = {
    forgetemail: null,
  };
  username: string = '';
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  resetFailed: boolean = false;
  errorMessage = '';
  errorMessage2 = '';
  roles: string[] = [];
  forgetModal: boolean = false;
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private layoutComponent: LayoutComponent
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getRole();
      this.router.navigate(['dashboard']);
    }
  }

  signUp(): void {
    this.router.navigate(['/signup']);
  }

  onSubmit(): void {
    const { email, password } = this.form;

    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.storageService.saveToken(data.token);
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.username = data.username;
        this.storageService.setUsername(data.username);
        this.layoutComponent.login();
        this.router.navigate(['/dashboard']);

        this.roles = this.storageService.getRole();
      },
      error: (error) => {
        console.log('hey err', error.error);
        this.errorMessage = error.error.error;
        this.isLoginFailed = true;
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
  notLoggedIn() {
    this.isLoggedIn = false;
  }

  forgotPassword() {
    this.forgetModal = true;
  }

  sendMail() {
    const { forgetemail } = this.form2;
    this.resetFailed = false;
    this.authService.sendEmailPassword(forgetemail).subscribe({
      next: (data) => {
        alert(data.result);
        this.forgetModal = false;
        this.router.navigate([this.router.url]);
      },
      error: (error) => {
        this.resetFailed = true;
        if (error?.error?.status == 400) this.errorMessage2 = error.error.error;
        else {
          this.errorMessage2 = 'Something went Wrong , Mail cannot be sent now';
        }
      },
    });
  }
}
