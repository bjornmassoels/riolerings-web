import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AllProjectsComponent } from './object-lists/all-projects/all-projects.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';
import { ProjectViewDialogComponent } from './projects/project-view/project-view-dialog/project-view-dialog.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupsAddComponent } from './groups/groups-add/groups-add.component';
import { GroupsEditComponent } from './groups/groups-edit/groups-edit.component';
import { GroupsViewComponent } from './groups/groups-view/groups-view.component';
import { SlokkerprojectViewComponent } from './slokkerprojects/slokkerproject-view/slokkerproject-view.component';
import { AllSlokkerprojectsComponent } from './object-lists/all-slokkerprojects/all-slokkerprojects.component';
import { PostnummerSettingsComponent } from './groups/postnummer-settings/postnummer-settings.component';
import { ProjectAddComponent } from './projects/project-add/project-add.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { SlokkerprojectEditComponent } from './slokkerprojects/slokkerproject-edit/slokkerproject-edit.component';
import { GroupsArchiveComponent } from './groups/groups-archive/groups-archive.component';
import { AdminComponent } from './admin/admin.component';
import { MultipleProjectAddComponent } from "./projects/multiple-project-add/multiple-project-add.component";
import { AllWachtaansluitingenComponent } from './object-lists/all-wachtaansluitingen/all-wachtaansluitingen.component';
import {ReadExcelComponent} from "./read-excel/read-excel.component";
import {ProjectAddExcelComponent} from "./projects/project-add-excel/project-add-excel.component";
import {SettingsVariableComponent} from "./groups/settings-variable/settings-variable.component";
import {SettingsComponent} from "./settings/settings.component";
import {SlokkerprojectAddComponent} from "./slokkerprojects/slokkerproject-add/slokkerproject-add.component";
import {ProjectLastworkerDialogComponent} from "./projects/project-edit/project-lastworker-dialog/project-lastworker-dialog.component";
import {BcStatisticsComponent} from "./bc-statistics/bc-statistics.component";
import {ReadExcelLambertComponent} from "./groups/read-excel-lambert/read-excel-lambert.component";
import {MeerwerkenViewComponent} from "./meerwerken/meerwerken-view/meerwerken-view.component";
import {MeerwerkenEditComponent} from "./meerwerken/meerwerken-edit/meerwerken-edit.component";
import {MeerwerkenAddComponent} from "./meerwerken/meerwerken-add/meerwerken-add.component";
import {AllMeerwerkenComponent} from "./object-lists/all-meerwerken/all-meerwerken.component";

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'admin',
      component: AdminComponent,
    },
    {
      path: 'statistics',
      loadChildren: () => import('./bc-statistics/bc-statistics.module').then(m => m.BcStatisticsModule)
    },
    {
      path: 'postnummer-settings/:id',
      component: PostnummerSettingsComponent,
    },
    {
      path: 'projectview/:id',
      component: ProjectViewComponent
    },
    {
      path: 'projectviewdialog/:id',
      component: ProjectViewDialogComponent,
    },
    {
      path: 'project-lastworker-dialog',
      component: ProjectLastworkerDialogComponent,
    },
    {
      path: 'slokkerproject-add/:id',
      component: SlokkerprojectAddComponent,
    },
    {
      path: 'meerwerk-add/:id',
      component: MeerwerkenAddComponent,
    },
    {
      path: 'projectedit/:id',
      component: ProjectEditComponent,
    },
    {
      path: 'slokkerprojectview/:id',
      component: SlokkerprojectViewComponent,
    },
    {
      path: 'slokkerprojectedit/:id',
      component: SlokkerprojectEditComponent,
    },
    {
      path: 'groupview/:id',
      component: GroupsViewComponent,
    },
    {
      path: 'meerwerkview/:id',
      component: MeerwerkenViewComponent,
    },
    {
      path: 'meerwerkedit/:id',
      component: MeerwerkenEditComponent,
    },
    {
      path: 'groups',
      component: GroupsComponent,
    },
    {
      path: 'settings',
      component: SettingsComponent,
    },
    {
      path: 'group-create',
      component: GroupsAddComponent,
    },
    {
      path: 'group-archive',
      component: GroupsArchiveComponent,
    },
    {
      path: 'group-edit/:id',
      component: GroupsEditComponent,
    },
    {
      path: 'project-add/:id',
      component: ProjectAddComponent
    },
    {
      path: 'users',
      loadChildren : () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
      path: 'multiple-project-add/:id',
      component: MultipleProjectAddComponent
    },
    {
      path: 'settings-variable/:id',
      component: SettingsVariableComponent
    },
    {
      path: 'read-excel',
      component: ReadExcelComponent
    },
    {
      path: 'read-excel-lambert/:id',
      component: ReadExcelLambertComponent
    },
    {
      path: 'project-add-excel',
      component: ProjectAddExcelComponent
    },
    {
      path: 'object-list',
      loadChildren: () => import('./object-lists/object-lists.module').then(m => m.ObjectListsModule)
    },
    {
      path: '',
      redirectTo: 'groups',
      pathMatch: 'full',
    },
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
