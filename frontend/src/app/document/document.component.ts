/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [HttpService, StorageService],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css',
})
export class DocumentComponent implements OnInit {
  protected items: any;
  protected file: string | ArrayBuffer | null = null;
  public searchTerm: string = '';
  public hover: string | null = null;
  public userName: string = '';
  public itemId: any;
  public docCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    let itemId;
    itemId = this.route.snapshot.paramMap.get('id');

    if (!itemId) {
      itemId = this.storageService.getUserId();
    }
    this.itemId = itemId;
    this.getDocumentById(itemId as string);
  }

  getDocumentById(id: string) {
    this.httpService.getDocumentById(id).subscribe((data) => {
      if (data.status == 200) {
        this.userName = data.name;
        this.docCount = data.count;
        this.items = data.result;
      }
    });
  }

  search() {
    if (!this.searchTerm) {
      this.getDocumentById(this.itemId);
    } else {
      this.httpService
        .searchDocumentByUserId(this.itemId, this.searchTerm)
        .subscribe((data) => {
          if (data.status == 200) {
            this.items = data.result;
            this.docCount = data.count;
          }
        });
    }
  }

  async getFile(path: string, filename: string) {
    try {
      const response = await this.httpService.getFileByPath(path);
      const blob = new Blob([response as Blob], {
        type: 'application/octet-stream',
      });
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = filename;
      link.click();

      // Revoke the object URL to avoid memory leaks
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      alert('File cannot be Fetched due to some reasons');
    }
  }
}
