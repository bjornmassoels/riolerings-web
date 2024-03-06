import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { Project } from '../../../../models/project';
import { FormService } from '../../../../services/form.service';
import {SlokkerProjects} from '../../../../models/slokker-projects';
import {Group} from "../../../../models/groups";
import {Meerwerk} from "../../../../models/meerwerk";
@Component({
  selector: 'all-meerwerken',
  templateUrl: './all-meerwerken.component.html',
  styleUrls: ['./all-meerwerken.component.scss', '../../styles/item-table.scss'],
})
export class AllMeerwerkenComponent implements OnInit {
  public projectItem: Project = new Project();
  public meerwerken: Array<Meerwerk> = [];
  public searchProjects: Array<Meerwerk> = [];
  public isOn: boolean;
  public group: Group;
  searchForm = new UntypedFormControl();
  filteredProjects: Observable<Meerwerk[]>;
  oneYearAgoDate: Date;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastrService: NbToastrService,
    private formService: FormService,
  ) {}

  async ngOnInit(): Promise<void> {
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    this.oneYearAgoDate = startDate;
    await this.apiService.getMeerwerken().subscribe((x) => {
      this.meerwerken = x as Meerwerk[];
      this.searchProjects = x as Meerwerk[];
        this.sortByDate();
        for(let i=0 ; i<this.searchProjects.length;i++){
          if(this.searchProjects[i].group_id != null){
            if(this.searchProjects[i].group_id.deleted === true){
              this.searchProjects.splice(i, 1);
            }
          } else {
            this.searchProjects.splice(i, 1);
          }
          if(this.searchProjects[i].startDate != null){
            this.searchProjects[i].startDate = new Date(this.searchProjects[i].startDate);
          }
        }
        for(let meerwerk of this.searchProjects){
          meerwerk.isMeerwerk = true;
        }
        this.formService.lastProjects = this.searchProjects as Project[];
        this.filteredProjects = this.searchForm.valueChanges.pipe(
          startWith(''),
          map((value) => (typeof value === 'string' ? value : value.street)),
          map((name) => (name ? this._filter(name) : this.meerwerken.slice())),
        );
        this.isOn = true;
      });
  }

  onClick(projectData) {
    const _id: string = projectData._id;
    // this.router.navigate(['/pages/editcategory', _id]);
  }


  drop(event: CdkDragDrop<string[]>) {
    /*moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
    // Otherwise products and apiService are unreachable in the foreach loop
    const itemList = this.projects;
    const api = this.apiService;
    this.projects.forEach(async function (p) {
      const index = itemList.indexOf(p);
      p.index = index + 1;
      await api.updateCategory(p);
    });*/
  }

  sortByDate() {
    const sortIndex = function (p1: Meerwerk, p2: Meerwerk) {
      if (new Date(p1.created) < new Date(p2.created)) {
        return 1;
      }
      if (new Date(p1.created) > new Date(p2.created)) {
        return -1;
      }
      return 0;
    };

    this.meerwerken.sort(sortIndex);
  }

  private _filter(street: string): Meerwerk[] {
    const filterValue = street.toLowerCase();
    return this.meerwerken.filter((item) =>
      item.street?.toString().includes(street.toLowerCase()) || item.huisNr.toString().includes(street.toLowerCase()),
    );
  }

  onSearch(_id: string) {
    this.formService.previousPage.push('/pages/meerwerken');
    this.router.navigate(['/pages/meerwerkview', _id]);
  }

  onSearchInput(input:string ){
    this.searchProjects = [];
      for (const r of this.meerwerken) {
        if(r.street != null){
          if (r.street.toLowerCase().includes(input.toLowerCase())) {
            this.searchProjects.push(r);
          }
        } else if(input === ""){
          this.searchProjects.push(r);
        }
      }
  }

  onSearchEnter(input: string) {
    let foundItemId: string;
    this.meerwerken.forEach(function (p) {
      if (p.street.toString() === input) {
        foundItemId = p._id;
      } else {
        const inputLength = input.length;
        if (
          p.street
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
      this.formService.previousPage.push('/pages/meerwerken');
      this.router.navigate(['/pages/meerwerkview', foundItemId]);
    } else {
      this.toastrService.warning(
        'De zoekfunctie heeft niks gevonden',
        'Sorry!',
      );
    }
  }

  Date(created: string) {
    return new Date(created).toLocaleDateString();
  }

  openProject(project: Meerwerk) {
    this.formService.previousPage.push('/pages/meerwerken');
    this.router.navigate(['/pages/meerwerkview', project._id]);
  }
}
