import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {UserEditComponent} from "./user-edit/user-edit.component";
import { UserCreateComponent } from './user-create/user-create.component';

const routes: Routes = [
      {
        path: 'user-create',
        component: UserCreateComponent
      },
      {
        path: 'edituser/:id',
        component: UserEditComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
