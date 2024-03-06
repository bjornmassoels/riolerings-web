import {Component, NgZone, OnInit} from '@angular/core';
import { UntypedFormBuilder , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {ApiService} from "../../../services/api.service";
import {User} from "../../../models/user";
import {NbToastrService} from "@nebular/theme";


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  isNameInvalid = false;
  isEmailInvalid = false;
  isPhoneInvalid = false;
  isStreetInvalid = false;
  isPostalInvalid = false;
  isCityInvalid = false;
  isPasswordInvalid = false;
  isChecked: boolean = false;
  isChecked2: boolean = false;
  loginResponse: any;
  user: User;
  addForm;
  constructor(private ngZone: NgZone,
              private formBuilder: UntypedFormBuilder, private router: Router,
              private apiService: ApiService, private toastrService: NbToastrService) {
    this.addForm = this.formBuilder.group({
      achternaam: ['',Validators.required],
      voornaam:  ['',Validators.required],
      gebruikersnaam:  ['',Validators.required],
      password:  ['',Validators.required],
      password2:  ['',Validators.required],
      bedrijfsnaam:  ['',Validators.required],
      code:  ['',Validators.required],
      email:  ['',Validators.required]
    });
  }

  successToast() {
    this.toastrService.success('Uw account is succesvol aangemaakt', 'Succes!');
  }
  failedToast(text: string) {
    this.toastrService.warning(text, 'Oops!');
  }
  ngOnInit() {}

  async submit(form) {
    form.gebruikersnaam = form.gebruikersnaam.trim();
    form.email = form.email.trim();
    form.name = form.voornaam + ' ' + form.achternaam;
    this.user = form as User;
    if(this.addForm.invalid){
      await this.failedToast('Gelieve alle velden in te vullen.');
      return;
    }
    if(form.gebruikersnaam.includes(' ')){
      await this.failedToast('Uw gebruikersnaam mag geen spaties bevatten.');
      return;
    }
    if(this.user.password.length < 6){
      await this.failedToast('Uw wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }
    if(this.user.password !== this.user.password2){
      await this.failedToast("De ingegeven wachtwoorden komen niet overeen.");
      return;
    }
    this.apiService.addUser(this.user).subscribe(async x =>{
      if(x === 'companyid'){
        await this.failedToast('Uw bedrijfscode klopt niet, vraag dit even na bij uw werkgever.');
      }
      else if(x === 'email') {
        await this.failedToast('Deze email is alreeds in gebruik.');
      } else if(x === 'gebruikersnaam'){
        await this.failedToast('Deze gebruikersnaam is alreeds in gebruik.');
      } else if(x === 'succes'){
        await this.successToast();
        await this.router.navigate(['/login']);
      }
    });
  }

  goBack() {
    this.router.navigate(['login']);
  }

}
