/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

const USER_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private currentUserSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  currentUser = this.currentUserSubject.asObservable();
  constructor(private router: Router) {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, token);
  }

  public getToken(): any {
    const token = window.sessionStorage.getItem(USER_KEY);
    if (token) {
      return token;
    }

    return 0;
  }

  public getUserId(): any {
    const token = window.sessionStorage.getItem(USER_KEY);
    if (token) {
      const decoded = jwtDecode(token);
      const { userId } = decoded as any;
      if (!userId) return -1;
      else return userId;
    }

    return 0;
  }

  public getRole(): any {
    const token = this.getToken();
    if (token) {
      const decoded = jwtDecode(token);
      const { role } = decoded as any;
      if (!role) return 'user';
      else return role;
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  logout(): void {
    window.sessionStorage.removeItem(USER_KEY);
    this.clean();
    this.router.navigate(['/login']);
  }

  public setUsername(username: string) {
    this.currentUserSubject.next(username);
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      this.clean();
      return true;
    }

    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    const exp = expiry * 1000;
    if (exp < Date.now()) {
      this.clean();
      return true;
    } else {
      return false;
    }
  }
}
