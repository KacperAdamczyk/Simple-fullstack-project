import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTaskComponent } from './add-edit-task/add-edit-task.component';
import { UserLoggedInGuard } from '../user/user-logged-in.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tasks',
    component: DashboardComponent,
    canActivate: [ UserLoggedInGuard ]
  },
  {
    path: 'task',
    component: AddEditTaskComponent,
    canActivate: [ UserLoggedInGuard ]
  },
  {
    path: 'task/:id',
    component: AddEditTaskComponent,
    canActivate: [ UserLoggedInGuard ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class TasksRoutingModule { }
