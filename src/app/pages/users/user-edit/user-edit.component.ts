import {Component, Inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { User } from '../../../../models/user';
import { UntypedFormBuilder } from '@angular/forms';
import { FormService } from '../../../../services/form.service';
import { ApiService } from '../../../../services/api.service';
import { Company } from '../../../../models/company';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';

@Component({
  selector: 'ngx-users-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  private _id: string;
  public isLoaded: boolean;
  users: User[];
  user: User;
  index: number;
  editForm;
  isVoornaamInvalid: boolean = false;
  isAchterNaamInvalid: boolean = false;
  isEmailInvalid: boolean = false;
  isGebruikersNaamInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isPassword2Invalid: boolean = false;
  isFunctieInvalid: boolean = false;
  isNoHelper: boolean = false;
  isChauffeur: boolean = false;
  public myCompany: Company;
  public adminCode: string;
  public code: string;
  public codeChauffeur: string;
  veranderWachtwoord: boolean = false;
  hasChangedValue: boolean = false;
  public functies: string[] = ["Werfleider", "Grondwerker"];
  talen: string[] = ['Nederlands', 'Frans', 'Engels', 'Pools'];
  isSaving: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private dialog: MatDialog,
    private formService: FormService
  ) {
    route.params.subscribe((val) => {
      this.loadData();
    });
  }

  async ngOnInit(){
    while(this.apiService.thisCompany == null){
      await this.delay(50)
    }
    this.myCompany = this.apiService.thisCompany;
    this.adminCode = this.myCompany.adminCode;
    this.code = this.myCompany.code;
  }

  loadData() {
    this._id = this.route.snapshot.paramMap.get('id');
    this.isChauffeur = false;
    this.isSaving = false;
    this.hasChangedValue = false;
    this.isLoaded = false;

    this.apiService.getUser(this._id).subscribe(x => {
      this.user = x as User;
      if(this.user._id == null){
        this.user._id = this.user.id;
      }
      if(this.user.role === '59cf78e883680012b0438501'){
        this.user.functieNaam = 'Werfleider';
      } else {
        this.user.functieNaam = 'Grondwerker';
      }
      this.veranderWachtwoord = false;
      if(this.user.name != null){
        let stringSplit = this.user.name.split(" ");
        let firstSpaceIndex = this.user.name.indexOf(" ");
        this.user.voornaam = stringSplit[0];
        this.user.achternaam = this.user.name.substr(firstSpaceIndex);
      }
      this.buildForm();
    })
  }

  buildForm() {
    if(this.user.taal == null){
      this.user.taal = 'Nederlands';
    }
    this.editForm = this.formBuilder.group({
      voornaam: this.user.voornaam,
      achternaam: this.user.achternaam,
      email: this.user.email,
      gebruikersnaam: this.user.gebruikersnaam,
      password: this.user.password,
      password2: this.user.password,
      functieNaam: this.user.functieNaam,
      wwCheckbox: false,
      taal: this.user.taal
    });
    this.isLoaded = true;
    this.editForm.valueChanges.subscribe(x => {
      this.hasChangedValue = true;
    });
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }
  checkChangedValue(route: string){
    if(this.hasChangedValue){
      this.formService.previousRoute = route;
      const dialogRef = this.dialog.open(HasChangedPopupComponent, {
        width:'450px',
        height:'200px',
        panelClass: 'mat-dialog-padding'
      });
    } else {
      this.router.navigate([route]);
    }
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
    } else {
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
    if (groupData.code === '' || groupData.code == null) {
      this.isFunctieInvalid = true;
      this.toastBadForm();
      return;
    }
    if(!this.checkEmptyLoginAccount(groupData)){
      if (groupData.gebruikersnaam === '' || groupData.gebruikersnaam == null) {
        this.isGebruikersNaamInvalid = true;
        this.toastBadForm();
        return;
      }

      if (this.veranderWachtwoord && (groupData.password === '' || groupData.password == null)) {
        this.isPasswordInvalid = true;
        this.toastBadForm();
        return;
      }
      if (this.veranderWachtwoord && (groupData.password2 === '' || groupData.password2 == null || groupData.password !== groupData.password2)) {
        this.isPassword2Invalid = true;
        this.toastBadForm();
        return;
      }
      if (groupData.gebruikersnaam.includes(' ')) {
        this.failedToast('Uw gebruikersnaam mag geen spaties bevatten.');
        return;
      }
      if (this.veranderWachtwoord && groupData.password.length < 6) {
        this.failedToast('Uw wachtwoord moet minimaal 6 tekens bevatten.');
        return;
      }
      groupData.gebruikersnaam = groupData.gebruikersnaam.trim();
    }
    if(!this.veranderWachtwoord){
      groupData.password = null;
    }
    if(groupData.functieNaam === 'Werfleider' ){
      groupData.role = '59cf78e883680012b0438501';
    } else {
      groupData.role = '59cf78e883680012b0438503';
    }

    if (this.editForm.invalid) {
      this.failedToast('Gelieve alle velden in te vullen.');
      return;
    }
    groupData.name = groupData.voornaam.trim() + ' ' + groupData.achternaam.trim();
    groupData._id = this.user._id;
    this.apiService.updateUserInfo(groupData).subscribe(x => {
      if(x === 'email') {
         this.failedToast('Deze email is alreeds in gebruik.');
      } else if(x === 'gebruikersnaam') {
         this.failedToast('Deze gebruikersnaam is alreeds in gebruik.');
      } else if(x === 'noPasswordArbeiderToLogin'){
        this.failedToast('Deze gebruiker heeft een wachtwoord nodig voordat u hem deze functie kan geven!');
      }  else if(x === 'succes'){
        this.hasChangedValue = false;
        this.isSaving = false;
        this.toastrService.success("De gebruiker " + groupData.voornaam + ' is gewijzigd', 'Succes!');
      }
    }, error => {
      this.failedToast('Er is iets misgegaan, probeer het opnieuw.');
    });
  }

  toastBadForm() {
    this.isSaving = false;
    this.toastrService.warning('Probeer het opnieuw', 'Oops!');
  }

  failedToast(text: string) {
    this.isSaving = false;
    this.toastrService.warning(text, 'Oops!');
  }
  goBack(){
    this.checkChangedValue('/pages/users');
  }
  onDeleteClick() {
    const dialogRef = this.dialog.open(DeleteDialogUser, {
      width:'450px'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(this.formService.isDelete){
        this.user._id = this._id;
        this.apiService.deleteUser(this.user).subscribe(x => {
          this.toastrService.danger(this.user.name + ' is verwijderd', 'Succes!');
          this.goBack();
        });
      }
    });

  }
  checkEmptyLoginAccount(user: User){
    if((user.gebruikersnaam === '' || user.gebruikersnaam == null) &&
      (user.password === '' || user.password == null) && (user.password2 === '' || user.password2 == null)){
      return true;
    } else {
      return false;
    }
  }
  onChangeWachtwoord($event: boolean) {
    this.veranderWachtwoord = $event;
  }
}

@Component({
  selector: 'delete-dialog-user',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialogUser {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogUser>,
    public formService: FormService
  ) {
    this.formService.isDelete = false;
  }

  onNoClick(): void {
    this.formService.isDelete = false;
    this.dialogRef.close();
  }

  onDeleteClick() {
    this.formService.isDelete = true;
    this.dialogRef.close();
  }
}
