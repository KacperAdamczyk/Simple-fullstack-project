import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTaskComponent } from './add-edit-task/add-edit-task.component';
import { UserLoggedInGuard } from '../user/user-logged-in.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailsComponent } from './task-details/task-details.component';

const routes: Routes = [
  {
    path: 'tasks',
    component: DashboardComponent,
    canActivate: [ UserLoggedInGuard ],
    children: [
      {
        path: '',
        canActivateChild: [ UserLoggedInGuard ],
        children: [
          {
            path: '',
            component: TaskDetailsComponent,
          },
          {
            path: 'add',
            component: AddEditTaskComponent,
          },
          {
            path: ':id',
            component: TaskDetailsComponent,
          },
          {
            path: 'edit/:id',
            component: AddEditTaskComponent,
          },
        ]
      }
    ]
  },
  {
    path: 'edit/:id',
    component: AddEditTaskComponent
  },
  {
    path: 'add',
    component: AddEditTaskComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class TasksRoutingModule {
}
