import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BcStatisticsComponent } from './bc-statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NbSelectModule } from '@nebular/theme';
import { MatButton } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BcStatisticsComponent }]),
    ReactiveFormsModule,
    NgxChartsModule,
    NbSelectModule,
    MatButton,
  ],
  declarations: [BcStatisticsComponent],
})
export class BcStatisticsModule {}
