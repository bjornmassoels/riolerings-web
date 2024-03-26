
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { NbToastrService } from "@nebular/theme";
import { User } from "../../../models/user";
import { Group } from "../../../models/groups";
import { FormService } from "../../../services/form.service";
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-multiple-project-add',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss', '../styles/item-table.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('autoInput') input;

  isCompanyAdmin: boolean;
  users: User[] = [];
  selectedUser: User;
  emptyGroups: Group[] = [];
  groups: Group[] = [];
  userr: any;
  hasLoaded: boolean = false;
  filterItemsNaam: User[] = [];
  observableFilteredItems$: Observable<string[]>;
  isUserCreate: boolean = false;
  constructor(
    private apiService: ApiService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private dialog: MatDialog,
    private formService: FormService
  ) {
  }

async ngOnInit(): Promise<void> {
  this.hasLoaded = false;
  this.isCompanyAdmin = this.apiService.isCompanyAdmin;

  const users$ = this.apiService.getUsers();
  const allGroups$ = this.apiService.getAllGroupsNoProjects();

  forkJoin([users$, allGroups$]).subscribe(([users, emptyGroups]) => {
    this.users = users as User[];
    this.emptyGroups = emptyGroups as Group[];

    // Remove specific user and modify the names
    this.users = this.users
      .filter(user => user.name !== 'bjorn programmeur selux')
      .map(user => {
        if (!user.name) {
          user.name = user.email + this.soortTranslateShort(user.role);
        } else {
          user.name += this.soortTranslateShort(user.role);
        }
        return user;
      })
      this.sortUsers();
      this.filterItemsNaam = this.users;
      this.observableFilteredItems$ = of(this.filterItemsNaam.map(x => x.name));
    this.hasLoaded = true;
  });
}
async ngAfterViewInit() {
    await this.delay(300);
  if(this.formService.selectedUser != null && this.users.find(x => x._id === this.formService.selectedUser._id) != null){
    this.userr = this.formService.selectedUser._id;
    this.input.nativeElement.value = this.formService.selectedUser.name;
    if(this.input.nativeElement.value != null && this.input.nativeElement.value !== ''){
        this.selectedUser = this.formService.selectedUser;
        this.changeUser(this.selectedUser._id);
    }
  } else {
    this.input.nativeElement.focus();
  }
}
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }
  sortUsers(){
     this.users = this.users.sort((a, b) => {
       if(a.role.localeCompare(b.role) !== 0) return b.role.localeCompare(a.role);
       if(a.name > b.name) return 1;
     });
  }
  changeUser(_id: string) {
    this.hasLoaded = false;
    this.groups = this.emptyGroups;
    this.selectedUser = this.users.find(x => x._id === _id);
    for (let group of this.groups) {
      let findGroup;
      if (this.selectedUser != null) {
        findGroup = this.selectedUser.groups.find(x => x._id === group._id);
      }
      if (findGroup != null) {
        group.isInUser = true;
      } else {
        group.isInUser = false;
      }
      group.createdDate = new Date(group.created);
    }
    this.groups.sort(
      (a, b) => b.createdDate.getTime() - a.createdDate.getTime(),
    );
    this.hasLoaded = true;
  }

  changeIsInUser(_id: string) {
    let index = this.groups.findIndex(x => x._id === _id);
    if (this.groups[index].isInUser === true) {
      this.groups[index].isInUser = false;
    } else {
      this.groups[index].isInUser = true;
    }
  }

  async updateUser() {
    this.selectedUser.groups = [];
    for (let group of this.groups) {
      if (group.isInUser != null && group.isInUser === true) {
        this.selectedUser.groups.push(group);
      }
    }
    let index = this.users.findIndex(x => x._id === this.selectedUser._id);
    this.users[index] = this.selectedUser;
    await this.apiService.updateUser(this.selectedUser).subscribe(x => {
      this.toastrService.success('De gebruiker zijn toegewezen projecten zijn gewijzigd', 'Succes!');
    });
  }
  soortTranslate(role: string){
    if(role === '59cf78e883680012b0438503'){
      return 'Grondwerker (mobile)';
    } else{
      return 'Werfleider';
    }
  }
  soortTranslateShort(role: string){
    if(role === '59cf78e883680012b0438503'){
      return ' (mobile)';
    } else {
      return '';
    }
  }

  updateUserDetails() {
    this.router.navigate(['/pages/users/edituser', this.selectedUser._id])
  }

  clearAutocomplete() {
    this.input.nativeElement.value = '';
    this.filterItemsNaam = this.users;
    this.selectedUser = null;
    this.formService.selectedUser = null;
    this.groups = [];
    this.observableFilteredItems$ = of(this.filterItemsNaam.map(x => x.name));
    this.input.nativeElement.focus();
  }

  clickAutoCompleteUser($event) {
    let naam = $event;
    if(naam != null && naam !== ''){
      let user = this.users.find(x => x.name === naam);
      if(user != null){
        this.selectedUser = user;
        this.changeUser(user._id);
        this.observableFilteredItems$ = of(this.filterItemsNaam.map(x => x.name));
        this.formService.selectedUser = user;
      }
    }
  }
  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }
  onChange() {
    this.observableFilteredItems$ = this.getFilteredOptions(this.input.nativeElement.value);
  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterItemsNaam.filter(optionValue => optionValue.name.toLowerCase().includes(filterValue)).map(optionValue => optionValue.name);
  }

  toggleUserCreate() {
    this.isUserCreate = !this.isUserCreate;
  }

  onAddUser() {
    this.ngOnInit();
  }
}



