import { NgModule , LOCALE_ID} from '@angular/core';
import {
  NbAutocompleteModule, NbButtonGroupModule, NbButtonModule,
  NbCheckboxModule, NbDatepickerModule, NbFormFieldModule, NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbOptionModule, NbPopoverModule,
  NbRadioModule,
  NbSelectModule, NbSpinnerModule, NbThemeModule,
  NbToggleModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import {  PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { GroupsAddComponent } from './groups/groups-add/groups-add.component';
import { GroupsEditComponent } from './groups/groups-edit/groups-edit.component';
import { GroupsViewComponent } from './groups/groups-view/groups-view.component';
import { FormService } from '../../services/form.service';
import {
  DialogOverviewExampleDialog2,
  SlokkerprojectViewComponent,
} from './slokkerprojects/slokkerproject-view/slokkerproject-view.component';
import { GroupsComponent } from './groups/groups.component';
import { ExcelService } from '../../services/ExcelService';
import { PostnummerSettingsComponent } from './groups/postnummer-settings/postnummer-settings.component';
import {
  DialogOverviewExampleDialog,
  ProjectViewComponent,
} from './projects/project-view/project-view.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { SlokkerprojectEditComponent } from './slokkerprojects/slokkerproject-edit/slokkerproject-edit.component';
import { ProjectViewDialogComponent } from './projects/project-view/project-view-dialog/project-view-dialog.component';
import { choicePipe } from '../../services/choice.pipe';
import { SlokkerprojectViewDialogComponent } from './slokkerprojects/slokkerproject-view/slokkerproject-view-dialog/slokkerproject-view-dialog.component';
import { GroupsViewDeleteDialogComponent } from './groups/groups-view/groups-view-delete-dialog/groups-view-delete-dialog.component';
import { ProjectViewDeleteDialogComponent } from './projects/project-view/project-view-delete-dialog/project-view-delete-dialog.component';
import { SlokkerprojectViewDeleteDialogComponent } from './slokkerprojects/slokkerproject-view/slokkerproject-view-delete-dialog/slokkerproject-view-delete-dialog.component';
import { GroupsArchiveComponent } from './groups/groups-archive/groups-archive.component';
import { AdminComponent } from './admin/admin.component';
import { MultipleProjectAddComponent } from './projects/multiple-project-add/multiple-project-add.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectAddComponent } from './projects/project-add/project-add.component';
import { ArchivePopupComponent } from './groups/archive-popup/archive-popup.component';
import { SlokkerPDFComponent } from 'app/components/slokker-pdf/slokker-pdf.component';
import { HuisaansluitingPDFComponent } from 'app/components/huisaansluiting-pdf/huisaansluiting-pdf.component';
import {ReadExcelComponent} from "./read-excel/read-excel.component";
import {ProjectAddExcelComponent} from "./projects/project-add-excel/project-add-excel.component";
import { MatIconModule } from '@angular/material/icon';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {SettingsVariableComponent} from "./groups/settings-variable/settings-variable.component";
import {SlokkerprojectAddComponent} from "./slokkerprojects/slokkerproject-add/slokkerproject-add.component";
import {ProjectLastworkerDialogConfirmComponent} from "./projects/project-edit/project-lastworker-dialog-confirm/project-lastworker-dialog-confirm.component";
import {SlokkerprojectLastworkerDialogConfirmComponent} from "./slokkerprojects/slokkerproject-edit/slokkerproject-lastworker-dialog-confirm/slokkerproject-lastworker-dialog-confirm.component";
import {ProjectLastworkerDialogComponent} from "./projects/project-edit/project-lastworker-dialog/project-lastworker-dialog.component";
import {SlokkerprojectLastworkerDialogComponent} from "./slokkerprojects/slokkerproject-edit/slokkerproject-lastworker-dialog/slokkerproject-lastworker-dialog.component";
import {LoadingBarModule} from "@ngx-loading-bar/core";
import {GroupsViewMeetstaatDialogComponent} from "./groups/groups-view/groups-view-meetstaat-dialog/groups-view-meetstaat-dialog.component";
import {ReadExcelLambertComponent} from "./groups/read-excel-lambert/read-excel-lambert.component";
import {
  DialogOverviewExampleDialog3,
  MeerwerkenViewComponent
} from "./meerwerken/meerwerken-view/meerwerken-view.component";
import {MeerwerkViewDeleteDialogComponent} from "./meerwerken/meerwerken-view/meerwerk-view-delete-dialog/meerwerk-view-delete-dialog.component";
import {MeerwerkViewDialogComponent} from "./meerwerken/meerwerken-view/meerwerk-view-dialog/meerwerk-view-dialog.component";
import {MeerwerkenLastworkerDialogComponent} from "./meerwerken/meerwerken-edit/meerwerken-lastworker-dialog/meerwerken-lastworker-dialog.component";
import {MeerwerkenLastworkerDialogConfirmComponent} from "./meerwerken/meerwerken-edit/meerwerken-lastworker-dialog-confirm/meerwerken-lastworker-dialog-confirm.component";
import {MeerwerkenEditComponent} from "./meerwerken/meerwerken-edit/meerwerken-edit.component";
import {MeerwerkenAddComponent} from "./meerwerken/meerwerken-add/meerwerken-add.component";
import {MeerwerkPdfComponent} from "../components/meerwerk-pdf/meerwerk-pdf.component";
import { NieuweExcelService } from '../../services/NieuweExcelService';
import { SharedModule } from '../../services/shared.module';
import { UpdatePopupDialogComponent } from './update-popup-dialog/update-popup-dialog.component';
import {
  GroupsViewPdfDownloadDialogComponent
} from './groups/groups-view/groups-view-pdf-download-dialog/groups-view-pdf-download-dialog.component';
import { GoogleMapsLocatiePopupComponent } from './googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersModule } from './users/users.module';
import {  NbMomentDateService } from '@nebular/moment';
import { HasChangedPopupComponent } from './has-changed-popup/has-changed-popup.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    FormsModule,
    NbInputModule,
    NbCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    DragDropModule,
    MatCardModule,
    NbRadioModule,
    NbSelectModule,
    NbOptionModule,
    NbToggleModule,
    NbCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NbMenuModule,
    LoadingBarModule,
    MatCheckboxModule,
    SharedModule,
    NbAutocompleteModule,
    NbButtonModule,
    GoogleMapsModule,
    UsersModule,
    NbIconModule,
    NbFormFieldModule,
    NbPopoverModule,
    NbButtonGroupModule,
    NbDatepickerModule,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    NbSpinnerModule,
    MatProgressSpinner,
  ],
  declarations: [
    PagesComponent,
    GroupsAddComponent,
    GroupsEditComponent,
    GroupsViewComponent,
    HuisaansluitingPDFComponent,
    SlokkerprojectViewComponent,
    GroupsComponent,
    PostnummerSettingsComponent,
    ProjectViewComponent,
    ProjectEditComponent,
    SlokkerprojectEditComponent,
    ProjectViewDialogComponent,
    choicePipe,
    SlokkerprojectViewDialogComponent,
    GroupsViewDeleteDialogComponent,
    ProjectViewDeleteDialogComponent,
    MeerwerkViewDeleteDialogComponent,
    SlokkerprojectViewDeleteDialogComponent,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialog2,
    DialogOverviewExampleDialog3,
    GroupsArchiveComponent,
    AdminComponent,
    MultipleProjectAddComponent,
    RegisterPageComponent,
    SettingsComponent,
    ProjectAddComponent,
    ArchivePopupComponent,
    SlokkerPDFComponent,
    MeerwerkViewDialogComponent,
    HuisaansluitingPDFComponent,
    ReadExcelComponent,
    ProjectAddExcelComponent,
    SettingsVariableComponent,
    SettingsComponent,
    PostnummerSettingsComponent,
    SlokkerprojectAddComponent,
    ProjectLastworkerDialogConfirmComponent,
    ProjectLastworkerDialogComponent,
    SlokkerprojectLastworkerDialogConfirmComponent,
    SlokkerprojectLastworkerDialogComponent,
    GroupsViewMeetstaatDialogComponent,
    ReadExcelLambertComponent,
    MeerwerkenViewComponent,
    MeerwerkenLastworkerDialogComponent,
    MeerwerkenLastworkerDialogConfirmComponent,
    MeerwerkenEditComponent,
    MeerwerkenAddComponent,
    MeerwerkViewDeleteDialogComponent,
    MeerwerkPdfComponent,
    UpdatePopupDialogComponent,
    GroupsViewPdfDownloadDialogComponent,
    GoogleMapsLocatiePopupComponent,
    HasChangedPopupComponent
  ],
  providers: [FormService, ExcelService, MatDatepickerModule, NieuweExcelService, NbMomentDateService],
  exports: [choicePipe],
})
export class PagesModule {}
