import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  providers: [StorageService],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  userName!: string;
  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}
  isAuthenticated() {
    return this.storageService.isLoggedIn();
  }
  ngOnInit(): void {
    this.storageService.currentUser.subscribe((username: string) => {
      console.log('name', username);
      this.userName = username;
      this.cdr.detectChanges();
    });
  }

  logOut() {
    this.storageService.logout();
  }
}
