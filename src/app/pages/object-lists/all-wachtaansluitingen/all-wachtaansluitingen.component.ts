import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Project } from '../../../../models/project';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'all-wachtaansluitingen',
  templateUrl: './all-wachtaansluitingen.component.html',
  styleUrls: ['./all-wachtaansluitingen.component.scss', '../../styles/item-table.scss']
})
export class AllWachtaansluitingenComponent implements OnInit {

  public projectItem: Project = new Project();
  public projects: Array<Project> = [];
  public searchProjectsInWacht: Array<Project> = [];
  public isOn: boolean = false;
  searchForm = new UntypedFormControl();
  filteredProjects: Observable<Project[]>;
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
    this.apiService.getProjects().subscribe(async (x) => {
      this.projects = x as Project[];
      this.searchProjectsInWacht = this.projects.filter(x => x.isWachtAansluiting || x.droogWaterAfvoer?.isWachtaansluiting || x.regenWaterAfvoer?.isWachtaansluiting);
      this.projects = this.searchProjectsInWacht;
      this.formService.lastProjects = this.searchProjectsInWacht;
      this.filteredProjects = this.searchForm.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.projectNr)),
        map((name) => (name ? this._filter(name) : this.projects.slice())),
      );
      this.isOn = true;
    });
  }

  onClick(projectData) {
    const _id: string = projectData._id;
    //this.router.navigate(['/pages/editcategory', _id]);
  }

  // async onAddCategory() {
  //   await this.apiService.getProjects().subscribe((x) => {
  //     this.projectsInWacht = x as Project[];
  //     this.sortByDate();
  //   });
  // }


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
    this.projects.sort(sortIndex)
    this.searchProjectsInWacht.sort(sortIndex);
  }

  private _filter(projectNr: string): Project[] {
    const filterValue = projectNr.toLowerCase();

    return this.projects.filter((item) =>
      item.projectNr.toString().includes(projectNr.toLowerCase()),
    );
  }


  onSearchInput(input:string ){
    this.searchProjectsInWacht = [];
      for (const r of this.projects) {
        if(r.street != null){
          if (r.street.toLowerCase().includes(input.toLowerCase())) {
            this.searchProjectsInWacht.push(r);
          }
        } else if(input === ""){
          this.searchProjectsInWacht.push(r);
        }
      }
  }

  onSearch(_id: string) {
    this.formService.previousPage.push('/pages/projects');
    this.router.navigate(['/pages/projectview', _id]);
  }

  onSearchEnter(input: string) {
    let foundItemId: string;
    this.searchProjectsInWacht.forEach(function (p) {
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
      this.formService.previousPage.push('/pages/projects');
      this.router.navigate(['/pages/projectview', foundItemId]);
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

  openProject(project: Project) {
    this.formService._chosenProject = project;
    this.formService.previousPage.push('/pages/projects');
    this.router.navigate(['/pages/projectview', project._id]);
  }
}
