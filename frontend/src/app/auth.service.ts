/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:3000/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post(AUTH_API + 'createuser', {
      firstname,
      lastname,
      email,
      password,
    });
  }

  forgotPassword(id: number, password: string, token: string): Observable<any> {
    return this.http.put(AUTH_API + `forget-password/${id}`, {
      password: password,
      token: token,
    });
  }

  sendEmailPassword(email: string): Observable<any> {
    return this.http.post(AUTH_API + `send-forget-mail`, {
      email: email,
    });
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
