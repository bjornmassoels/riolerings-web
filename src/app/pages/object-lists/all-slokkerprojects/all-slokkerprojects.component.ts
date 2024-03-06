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
@Component({
  selector: 'all-slokkerprojects',
  templateUrl: './all-slokkerprojects.component.html',
  styleUrls: ['./all-slokkerprojects.component.scss', '../../styles/item-table.scss'],
})
export class AllSlokkerprojectsComponent implements OnInit {
  public projectItem: Project = new Project();
  public projects: Array<SlokkerProjects> = [];
  public searchProjects: Array<SlokkerProjects> = [];
  public isOn: boolean;
  public group: Group;
  searchForm = new UntypedFormControl();
  filteredProjects: Observable<SlokkerProjects[]>;
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
    await this.apiService.getSlokkerProjects().subscribe((x) => {
      this.projects = x as SlokkerProjects[];
      this.searchProjects = x as SlokkerProjects[];
      this.formService.PreloadProject = null;
        this.sortByDate();
        for (const project of this.searchProjects) {
          project.isSlokker = true;
        }
        for(let i=0 ; i<this.searchProjects.length;i++){
          if(this.searchProjects[i].group_id != null){
            if(this.searchProjects[i].group_id.deleted === true){
              this.searchProjects.splice(i, 1);
            }
          } else {
            this.searchProjects.splice(i, 1);
          }
        }
        this.formService.lastProjects = this.searchProjects as Project[];
        this.filteredProjects = this.searchForm.valueChanges.pipe(
          startWith(''),
          map((value) => (typeof value === 'string' ? value : value.street)),
          map((name) => (name ? this._filter(name) : this.projects.slice())),
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
    const sortIndex = function (p1: Project, p2: Project) {
      if (new Date(p1.created) < new Date(p2.created)) {
        return 1;
      }
      if (new Date(p1.created) > new Date(p2.created)) {
        return -1;
      }
      return 0;
    };

    this.projects.sort(sortIndex);
  }

  private _filter(street: string): SlokkerProjects[] {
    const filterValue = street.toLowerCase();
    return this.projects.filter((item) =>
      item.street?.toString().includes(street.toLowerCase()) || item.huisNr.toString().includes(street.toLowerCase()),
    );
  }

  onSearch(_id: string) {
    this.formService.previousPage.push('/pages/slokkerprojects');
    this.router.navigate(['/pages/projectview', _id]);
  }

  onSearchInput(input:string ){
    this.searchProjects = [];
      for (const r of this.projects) {
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
    this.projects.forEach(function (p) {
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
      this.formService.previousPage.push('/pages/slokkerprojects');
      this.router.navigate(['/pages/slokkerprojectview', foundItemId]);
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

  openProject(project: SlokkerProjects) {
    this.formService.previousPage.push('/pages/slokkerprojects');
    this.router.navigate(['/pages/slokkerprojectview', project._id]);
  }
}
