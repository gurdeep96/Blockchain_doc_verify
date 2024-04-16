/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import {
  DecodedToken,
  UploadFileComponent,
} from '../upload-file/upload-file.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, UploadFileComponent],
  providers: [HttpService, StorageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  protected users: any;
  public id: number = -1;
  public email: string = '';
  constructor(
    private httpService: HttpService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.httpService.getAllUsers().subscribe((data) => {
      if (data.status == 200) {
        this.users = data.result;
      }
    });
  }

  getDocumentById(id: number) {
    this.router.navigate(['/document', id]);
  }

  uploadDocument(id: number, email: string) {
    this.id = id;
    this.email = email;
    this.storageService.setUserData(id, email);
    const bearerToken = this.storageService.getToken();
    const decoded: DecodedToken = jwtDecode(bearerToken);
    const { role } = decoded;
    if (role == 'user') {
      alert('You do not have Upload Access!');
    } else {
      this.router.navigate(['/upload', id, email]);
    }
  }
}
