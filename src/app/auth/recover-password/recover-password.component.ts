import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ApiService } from 'services/api.service';

@Component({
  selector: 'recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  wachtwoord1: any;
  wachtwoord2: any;
  code: string;
  id: string;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toast: NbToastrService
   ) { }

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get("code");
    this.id = this.route.snapshot.paramMap.get("id");
  }

  login() {
    if(this.wachtwoord1 == null || this.wachtwoord2 == null){
      this.toast.danger("","Vul wachtwoorden in!");
    } else if(this.wachtwoord1 === this.wachtwoord2){
        this.apiService.recoverPassword(this.wachtwoord1, this.code, this.id).subscribe(x => {
        this.toast.success("","Uw wachtwoord is gewijzigd!");
        this.router.navigate(['auth/login']);
      })
    } else {
      this.toast.danger("","Wachtwoord 1 en Wachtwoord 2 zijn niet hetzelfde!");

    }
  }

}
