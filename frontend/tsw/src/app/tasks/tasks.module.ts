import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared/shared.module';
import { TaskBriefComponent } from './task-brief/task-brief.component';
import { MatCheckboxModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEditTaskComponent } from './add-edit-task/add-edit-task.component';
import { TasksPipe } from './tasks.pipe';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDetailsComponent } from './task-details/task-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TasksRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  declarations: [
    DashboardComponent,
    TaskBriefComponent,
    TaskDetailsComponent,
    AddEditTaskComponent,
    TasksPipe
  ]
})
export class TasksModule { }
