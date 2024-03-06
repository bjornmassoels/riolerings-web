import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { AllMeerwerkenComponent } from './all-meerwerken/all-meerwerken.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { AllWachtaansluitingenComponent } from './all-wachtaansluitingen/all-wachtaansluitingen.component';
import { AllSlokkerprojectsComponent } from './all-slokkerprojects/all-slokkerprojects.component';

const routes: Routes = [
    {
      path: 'meerwerken',
      component: AllMeerwerkenComponent,
    },
    {
      path: 'projects',
      component: AllProjectsComponent,
    },
    {
      path: 'wachtaansluitingen',
      component: AllWachtaansluitingenComponent,
    },
    {
      path: 'slokkerprojects',
      component: AllSlokkerprojectsComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectListsRoutingModule { }
