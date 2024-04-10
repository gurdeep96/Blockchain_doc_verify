import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TokenExpirationGuard } from './auth-token.guard';
import { DocumentComponent } from './document/document.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyfileComponent } from './verifyfile/verifyfile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    canActivate: [TokenExpirationGuard],
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    canActivate: [TokenExpirationGuard],
    component: DashboardComponent,
  },
  {
    path: 'verify',
    canActivate: [TokenExpirationGuard],
    component: VerifyfileComponent,
  },
  {
    path: 'document',
    canActivate: [TokenExpirationGuard],
    component: DocumentComponent,
  },
  {
    path: 'document/:id',
    canActivate: [TokenExpirationGuard],
    component: DocumentComponent,
  },
  {
    path: 'upload',
    canActivate: [TokenExpirationGuard],
    component: UploadFileComponent,
  },
  {
    path: 'upload/:id/:email',
    canActivate: [TokenExpirationGuard],
    component: UploadFileComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [TokenExpirationGuard],
        component: DashboardComponent,
      },
    ],
  },
];
