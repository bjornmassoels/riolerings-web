import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ObjectListsRoutingModule} from "./object-lists.routing.module";
import { AllMeerwerkenComponent } from './all-meerwerken/all-meerwerken.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { AllSlokkerprojectsComponent } from './all-slokkerprojects/all-slokkerprojects.component';
import { AllWachtaansluitingenComponent } from './all-wachtaansluitingen/all-wachtaansluitingen.component';
import { CdkScrollable } from '@angular/cdk/overlay';
import { NbInputModule } from '@nebular/theme';
import { CdkDropList } from '@angular/cdk/drag-drop';
@NgModule({
  imports: [
    ObjectListsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    NbInputModule,
    CdkDropList,
  ],
  declarations: [AllProjectsComponent, AllSlokkerprojectsComponent, AllMeerwerkenComponent, AllWachtaansluitingenComponent],
})
export class ObjectListsModule {}
