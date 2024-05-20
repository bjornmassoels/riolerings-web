import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Group } from '../../../models/groups';
import { FormService } from '../../../services/form.service';
import { ExcelService } from '../../../services/ExcelService';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Company } from '../../../models/company';
import { MatDialog } from '@angular/material/dialog';

declare var Pace: any;

@Component({
  selector: 'groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss', '../styles/item-table.scss'],
})
export class GroupsComponent implements OnInit {
  searchItems: string[] = ['Project nr.', 'Projectnaam', 'Gemeente'];
  searchItem: string = 'Project nr.';
  groupForm: UntypedFormGroup;
  public groups: Group[] = [];
  public searchedGroups: Group[] = [];
  group: Group;
  company: Company;
  searchForm = new UntypedFormControl();
  filteredGroups: Observable<Group[]>;
  groupSelected: any;
  searchSelect: any;
  linesR: any[];
  lines: any[];
  paidGroup: number[] = [];
  unPaidGroup: number[] = [];
  title = 'XlsRead';
  file: File;
  arrayBuffer: any;
  filelist: any;
  isLoaded: boolean = false;
  isAdmin: boolean = false;
  isViewConnectedUsers: boolean = false;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastrService: NbToastrService,
    private formService: FormService,
    private formBuilder: UntypedFormBuilder,
    private excelService: ExcelService,
    private dialog: MatDialog,
  ) {
    this.searchSelect = 'Project nr.';
    this.groupForm = this.formBuilder.group({
      selected: '',
    });
    this.filteredGroups = this.searchForm.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.projectNr)),
      map((projectNr) =>
        projectNr ? this._filter(projectNr) : this.groups.slice(),
      ),
    );
  }

  async ngOnInit() {
    this.isViewConnectedUsers = false;
    if(!this.apiService.isMobileUser){
      this.apiService.getAllGroups().subscribe( async (x) => {
        const tempGroups = x as Group[];
        for (const group of tempGroups) {
          group.totalProjectCount =
            group.slokkerProjectList?.length + group.projectList?.length;
          group.haCount = group.projectList?.length;
          group.kolkCount = group.slokkerProjectList?.length;
          group.createdDate = new Date(group.created);
        }
        tempGroups.sort(
          (a, b) => b.createdDate.getTime() - a.createdDate.getTime(),
        );
        while(this.apiService.thisCompany == null){
          await this.delay(50)
        }
        this.isAdmin = this.apiService.isAdmin;

        this.company = this.apiService.thisCompany;

        if (this.company.P0 != null || this.company.prijsPerHA != null) {
          let i = 0;
          for (const group of tempGroups) {
            this.paidGroup.push(0);
            this.unPaidGroup.push(0);
            for (let project of group.projectList) {
              if(project.paid){
                this.paidGroup[i] = this.paidGroup[i] + 1;
              } else {
                this.unPaidGroup[i] = this.unPaidGroup[i] + 1;
              }
            }
            for (let slokkerproject of group.slokkerProjectList) {
              if(slokkerproject.paid){
                this.paidGroup[i] = this.paidGroup[i] + 1;
              } else {
                this.unPaidGroup[i] = this.unPaidGroup[i] + 1;
              }
            }
            i++;
          }
        }
        this.groups = tempGroups;
        this.searchedGroups = tempGroups;
        Pace.stop();

        this.isLoaded = true;
        this.formService.previousIndex = null;
        this.formService.previousStreet = null;
        this.formService.previousFilter = null;
        this.formService.previousSorteer = null;
        this.formService.filterTussenDateStartString = null;
        this.formService.filterTussenDateEndString = null;
        this.formService._allGroups = this.groups;
        if (this.formService.previousGroupIndex != null) {
          let behavior: string = 'auto';
          const rows = document.getElementsByClassName("scroll");
          setTimeout(() => {
            rows[this.formService.previousGroupIndex].scrollIntoView({
              behavior: <ScrollBehavior>behavior.toString(),
              block: 'center'
            });
            this.formService.previousGroupIndex = null;
          }, 10);
        }
      });
    } else {
      this.toastrService.danger('U heeft geen toegang tot deze pagina. Het account waar u mee probeert in te loggen heeft als functie Ploegbaas', 'Sorry!',{position: NbGlobalLogicalPosition.TOP_START, duration: 4500});
      await this.delay(5000);
      this.router.navigate(['/auth/login']);
    }
  }

  private _filter(name: string): Group[] {
    const filterValue = name.toLowerCase();

    return this.groups.filter((item) =>
      item.projectNr.toLowerCase().includes(name.toLowerCase()),
    );
  }

  onSearchEnter(input: string) {
    let foundItemId: string;
    this.groups.forEach(function (p) {
      if (p.projectNr.toString() === input) {
        foundItemId = p._id;
      } else {
        const inputLength = input.length;
        if (
          p.projectNr
            .toString()
            .toLowerCase()
            .substring(0, inputLength)
            .includes(input.toLowerCase())
        ) {
          foundItemId = p._id;
        }
      }
    });
    if (foundItemId) {
      const group = this.groups.find(x => x._id === foundItemId);
      this.formService._chosenGroup = group;
      this.formService.previousPage.push('/pages/groups');
      this.router.navigate(['/pages/groupview', foundItemId]);
    } else {
      this.toastrService.warning(
        'De zoekfunctie heeft niks gevonden',
        'Sorry!',
      );
    }
  }
  onSearchInput(input:string ){
    this.searchedGroups = [];
    if(this.searchItem === "Project nr."){
      for (const r of this.groups) {
        if(r.rbProjectNr != null){
          if (r.rbProjectNr.toLowerCase().includes(input.toLowerCase())) {
            this.searchedGroups.push(r);
          }
        } else if(input === ""){
          this.searchedGroups.push(r);
        }
      }

    } else if(this.searchItem === "Projectnaam"){
      for (const r of this.groups) {
        if(r.rbProjectNaam != null){
          if (r.rbProjectNaam.toLowerCase().includes(input.toLowerCase())) {
            this.searchedGroups.push(r);
          }
        } else if(input === ""){
          this.searchedGroups.push(r);
        }
      }

    } else {          //GEMEENTE
      for (const r of this.groups) {
        if(r.rbGemeente != null){
          if (r.rbGemeente.toLowerCase().includes(input.toLowerCase())) {
            this.searchedGroups.push(r);
          }
        } else if(input === ""){
          this.searchedGroups.push(r);
        }
      }
    }

  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  openGroup(chosenGroup: Group) {
    this.formService._chosenGroup = chosenGroup;
    this.formService.previousGroupIndex = this.groups.indexOf(chosenGroup);
    this.router.navigate(['/pages/groupview', chosenGroup._id]);
  }
  goToAdmin() {
    this.router.navigate(['/pages/admin']);
  }
  onClick(chosenGroup: Group) {
    this.formService._chosenGroup = chosenGroup;
    this.formService.previousPage.push('/pages/groups');
    this.router.navigate(['/pages/group-edit', chosenGroup._id]);
  }

  onSearch(_id: string) {
    const group = this.groups.find(x => x._id === _id);
    this.formService._chosenGroup = group;
    this.formService.previousPage.push('/pages/groups');
    this.router.navigate(['/pages/groupview', _id]);
  }

  goToCreate() {
    this.formService.previousPage.push('/pages/groups');
    this.router.navigate(['/pages/group-create']);
  }

  selectItem(item: string) {
    this.searchItem = item;
  }


  readExcel() {
    this.router.navigate(['/pages/read-excel']);
  }

  showConnectedUsers() {
     if(!this.isViewConnectedUsers){
       this.apiService.getConnectedUsersOfGroups().subscribe((groups: Group[]) => {
         let userGroups = groups as Group[];
         for(let group of this.searchedGroups){
           group.users  = userGroups.find(x => x._id === group._id).users;
         }
         this.isViewConnectedUsers = true;
       });
     } else {
        this.isViewConnectedUsers = false;
     }
  }
}
