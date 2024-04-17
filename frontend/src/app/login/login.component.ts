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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any = {
    email: null,
    password: null,
  };
  username: string = '';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
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

  forgotPassword(): void {
    this.router.navigate(['/forget']);
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
}
