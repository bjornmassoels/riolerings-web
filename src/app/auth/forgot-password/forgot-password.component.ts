import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ApiService } from 'services/api.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email: any;

  constructor
    (
    private apiService: ApiService,
    private router: Router,
    private toast: NbToastrService
    )
  {}

  ngOnInit() {}


  goBack() {
    this.router.navigate(['/login-page'])
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }
  login() {

    if (this.email != null ) {
      this.apiService.forgotPassword(this.email).subscribe( async x => {
        if(x === 'notfound'){
            this.toast.danger("Er bestaat geen account met deze email.", "Error" )
        } else {
          this.toast.success("Email is verstuurd naar " + this.email + "! GELIEVE UW SPAM FOLDER TE CONTROLEREN", "Succes!");
          await this.delay(2500);
          this.goBack();
        }
      });
    }
  }
}
