/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  providers: [HttpService, StorageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  protected users: any;
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
    this.storageService.setUserData(id, email);
    this.router.navigate(['/upload', id, email]);
  }
}
