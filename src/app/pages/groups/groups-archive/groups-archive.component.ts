import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { NbToastrService } from '@nebular/theme';
import { UntypedFormBuilder, UntypedFormControl, FormGroup } from '@angular/forms';
import { Group } from '../../../../models/groups';
import { FormService } from '../../../../services/form.service';
import { ExcelService } from '../../../../services/ExcelService';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Company } from '../../../../models/company';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'groups-archive',
  templateUrl: './groups-archive.component.html',
  styleUrls: [
    './groups-archive.component.scss',
    '../../styles/item-table.scss',
  ],
})
export class GroupsArchiveComponent implements OnInit {
  searchItems: string[] = ['Project nr.', 'Projectnaam', 'Gemeente', 'Straat'];
  searchItem: string = 'Project nr.';
  public groups: Group[] = [];
  group: Group;
  company: Company;
  searchForm = new UntypedFormControl();
  filteredGroups: Observable<Group[]>;
  groupSelected: any;
  searchSelect: any;
  isLoaded: boolean = false;

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
    this.filteredGroups = this.searchForm.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.projectNr)),
      map((projectNr) =>
        projectNr ? this._filter(projectNr) : this.groups.slice(),
      ),
    );
  }

  ngOnInit(){
    this.isLoaded = false;
    this.apiService.getGroupsArchive().subscribe(async (x) => {
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
      this.groups = tempGroups;
      this.formService._allGroups = this.groups;
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.isLoaded = true;

    });
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
      this.formService.previousPage.push('/pages/groups');
      this.router.navigate(['/pages/groupview', foundItemId]);
    } else {
      this.toastrService.warning(
        'De zoekfunctie heeft niks gevonden',
        'Sorry!',
      );
    }
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  openGroup(chosenGroup: Group) {
    this.formService._chosenGroup = chosenGroup;
    this.formService.previousPage.push('/pages/groups');
    this.router.navigate(['/pages/groupview', chosenGroup._id]);
  }

  onClick(chosenGroup: Group) {
    this.formService._chosenGroup = chosenGroup;
    this.formService.previousPage.push('/pages/groups');
    this.router.navigate(['/pages/group-edit', chosenGroup._id]);
  }

  onSearch(_id: string) {
    this.formService._chosenGroup._id = _id;
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
}
