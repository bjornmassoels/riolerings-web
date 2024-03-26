import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsersRoutingModule} from "./users.routing.module";
import {UsersComponent} from "./users.component";
import { NbAutocompleteModule, NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { DeleteDialogUser, UserEditComponent } from './user-edit/user-edit.component';
import {UserCreateComponent} from "./user-create/user-create.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import { UserDeleteDialogComponent } from './user-delete-dialog/user-delete-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    UsersRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UsersComponent }]),
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    NbCheckboxModule,
    NbSelectModule,
    NbInputModule,
    NbAutocompleteModule,
    MatSelectModule,
    NbTabsetModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
    NbButtonModule,
  ],
  declarations: [UsersComponent, UserCreateComponent,  UserEditComponent,  DeleteDialogUser, UserDeleteDialogComponent],
})
export class UsersModule {}
