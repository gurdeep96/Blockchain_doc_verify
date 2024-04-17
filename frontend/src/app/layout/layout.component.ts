/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
} from '@angular/core';
import { StorageService } from '../storage.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [StorageService],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutComponent {
  userNames: any;
  userFlag: boolean = false;
  nameSubscribe: any;

  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  isAuthenticated() {
    return this.storageService.isLoggedIn();
  }

  login() {
    setTimeout(() => {
      this.storageService.currentUser.subscribe({
        next: (username) => {
          this.userFlag = true;
          this.ngZone.run(() => {
            this.userNames = username;
            console.log(this.userNames);
            //this.cdr.detectChanges();
          });
        },
        error: (err) => {
          console.log('err name', err);
        },
      });
    }, 10);
  }

  logOut() {
    this.userFlag = false;
    this.storageService.logout();
  }

  // ngOnDestroy() {
  //   this.storageService.currentUser.subscribe();
  // }
}
