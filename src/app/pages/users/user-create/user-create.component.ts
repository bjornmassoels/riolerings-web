import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Company } from 'models/company';
import { User } from 'models/user';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import { group } from '@angular/animations';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  addForm: UntypedFormGroup;
  public isLoaded: boolean;
  @Output() outputEvent: EventEmitter<string> = new EventEmitter();

  isVoornaamInvalid: boolean = false;
  isAchterNaamInvalid: boolean = false;
  isEmailInvalid: boolean = false;
  isGebruikersNaamInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isPassword2Invalid: boolean = false;
  isFunctieInvalid: boolean = false;
  newUser: User;
  talen: string[] = ['Nederlands', 'Frans', 'Engels', 'Pools'];
  public functies: string[] = ["Werfleider", "Grondwerker"];
  public myCompany: Company;
  public adminCode: string;
  public code: string;
  isSaving: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private formService: FormService,
    private router: Router
  ) {
  }
  async ngOnInit() {
    this.buildForm();
    while (this.apiService.thisCompany == null) {
      await this.delay(50)
    }
    this.myCompany = this.apiService.thisCompany;
    this.adminCode = this.myCompany.adminCode;
    this.code = this.myCompany.code;

    this.isLoaded = true;
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }
  public buildForm() {
    this.isSaving = false;
    this.addForm = this.formBuilder.group({
      voornaam: '',
      achternaam: '',
      email: '',
      gebruikersnaam: '',
      password: '',
      password2: '',
      functieNaam: 'Grondwerker',
      taal: 'Nederlands'
      //code moet ook nog (werfleider of wn)
    });
  }
  onSubmit(groupData: User) {
    if(this.isSaving)return;
    this.isSaving = true;
    this.isVoornaamInvalid = false;
    this.isAchterNaamInvalid = false;
    this.isGebruikersNaamInvalid = false;
    this.isPasswordInvalid = false;
    this.isPassword2Invalid = false;
    this.isFunctieInvalid = false;

    if (groupData.functieNaam === 'Werfleider') {
      groupData.code = this.adminCode
    } else if (groupData.functieNaam === 'Grondwerker') {
      groupData.code = this.code;
    }

    if (groupData.voornaam === '' || groupData.voornaam == null) {
      this.isVoornaamInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.achternaam === '' || groupData.achternaam == null) {
      this.isAchterNaamInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.gebruikersnaam === '' || groupData.gebruikersnaam == null) {
      this.isGebruikersNaamInvalid = true;
      this.toastBadForm();
      return;
    }

    if (groupData.password === '' || groupData.password == null) {
      this.isPasswordInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.password2 === '' || groupData.password2 == null || groupData.password !== groupData.password2) {
      this.isPassword2Invalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.code === '' || groupData.code == null) {
      this.isFunctieInvalid = true;
      this.toastBadForm();
      return;
    }


    if (this.addForm.invalid) {
      this.failedToast('Gelieve alle velden in te vullen.');
      return;
    }
    if (groupData.gebruikersnaam.includes(' ')) {
      this.failedToast('Uw gebruikersnaam mag geen spaties bevatten.');
      return;
    }
    if (groupData.password.length < 6) {
      this.failedToast('Uw wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }
    groupData.gebruikersnaam = groupData.gebruikersnaam.trim();
    groupData.email = groupData.email?.trim();
    groupData.name = groupData.voornaam.trim() + ' ' + groupData.achternaam.trim();
    this.newUser = groupData as User;

    this.apiService.addUser(this.newUser).subscribe(x => {
      if(x === 'email') {
         this.failedToast('Deze email is alreeds in gebruik.');
      } else if(x === 'gebruikersnaam'){
         this.failedToast('Deze gebruikersnaam is alreeds in gebruik.');
      } else if(x === 'succes'){
        this.toastrService.success("De gebruiker " + this.newUser.gebruikersnaam + ' is aangemaakt', 'Succes!');
        this.addForm.reset();
        this.isSaving = false;
        this.outputEvent.emit('added user');
        this.addForm.controls['taal'].setValue('Nederlands');
        this.addForm.controls['functieNaam'].setValue(this.newUser.functieNaam);
        this.addForm.controls['password'].setValue(groupData.password);
        this.addForm.controls['password2'].setValue(groupData.password);
      }
    }, error => {
    this.failedToast('Er is iets misgegaan.');
    });
  }

  failedToast(text: string) {
    this.isSaving = false;
    this.toastrService.warning(text, 'Oops!');
  }

  toastBadForm() {
    this.isSaving = false;
    this.toastrService.warning('Probeer het opnieuw', 'Oops!');
  }

}
