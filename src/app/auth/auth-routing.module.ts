import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { NgxLoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import {
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {RegisterPageComponent} from "../pages/register-page/register-page.component";
import { AccountDeletionUrlComponent } from './account-deletion-url/account-deletion-url.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: NgxLoginComponent, // <---
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent, // <---
      },
      {
        path: 'recover-password/:code/:id',
        component: RecoverPasswordComponent, // <---
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: 'account-deletion-url',
        component: AccountDeletionUrlComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {}
