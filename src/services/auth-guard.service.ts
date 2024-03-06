import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import {Company} from "../models/company";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  public thisCompany: Company;
  constructor(
    private authService: NbAuthService,
    private router: Router,
    private apiService: ApiService,
  ) // private userInfoService: UserInfoService
  {}

  isAdmin: boolean;

  canActivate() {
    return this.authService.isAuthenticated().pipe(
      tap(async (authenticated) => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        } else {
          if(this.thisCompany == null){
            await this.apiService.getCompany().subscribe(x => {
              this.thisCompany = x as Company;
              if (this.thisCompany._id == null) {
                this.thisCompany._id = this.thisCompany.id;
              }
              this.apiService.thisCompany = this.thisCompany;
              return true;
            });
          } else {
            return true;
          }
        }
      }),
    );
  }
}
