/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule],
  providers: [HttpService],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css',
})
export class DocumentComponent implements OnInit {
  protected items: any;
  protected file: string | ArrayBuffer | null = null;
  hover: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    this.getDocumentById(itemId as string);
  }

  getDocumentById(id: string) {
    this.httpService.getDocumentById(id).subscribe((data) => {
      if (data.status == 200) {
        this.items = data.result;
      }
    });
  }

  async getFile(path: string, filename: string) {
    try {
      const response = await this.httpService.openFileInNewTab(path);
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
