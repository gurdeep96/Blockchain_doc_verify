/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const BACKEND_API = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getBackendUrl(): string {
    return BACKEND_API;
  }

  getAllUsers(): Observable<any> {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      }),
    };
    return this.http.get(BACKEND_API + '/getusers', httpOptions);
  }

  getDocumentById(id: string): Observable<any> {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      }),
    };

    return this.http.get(BACKEND_API + `/documents/user/${id}`, httpOptions);
  }

  searchDocumentByUserId(id: string, searchTerm: string): Observable<any> {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      }),
    };

    return this.http.post(
      BACKEND_API + `/documents/search/${id}`,
      { search: searchTerm },
      httpOptions
    );
  }

  uploadFile(form: any, userId: string) {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${bearerToken}`,
      }),
    };
    return this.http.post(
      BACKEND_API + `/documentupload/${userId}`,
      form,
      httpOptions
    );
  }

  uploadFileIpfs(form: any, userId: string) {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${bearerToken}`,
      }),
    };
    return this.http.post(
      BACKEND_API + `/docupload/${userId}`,
      form,
      httpOptions
    );
  }

  updateFileTransactionHash(id: number, txId: string) {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${bearerToken}`,
      }),
    };
    return this.http.put(
      BACKEND_API + `/document/updatetransaction/${id}`,
      { txId: txId },
      httpOptions
    );
  }

  getFileByPath(path: string) {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      }),
      params: { docId: path },
      responseType: 'blob' as const,
    };
    return this.http.get(BACKEND_API + `/getfile`, httpOptions).toPromise();
  }

  verifyFile(value: string, option: string) {
    const bearerToken = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${bearerToken}`,
      }),
    };
    return this.http.post(
      BACKEND_API + `/checkfileauthenticity`,
      {
        hash: value,
        option: option,
      },
      httpOptions
    );
  }

  private extractFile(response: Response) {
    const body = response.json();
    return body || {};
  }
}
