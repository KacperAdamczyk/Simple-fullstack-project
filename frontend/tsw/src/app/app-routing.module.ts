import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './ui/error/error.component';
import { NotFoundComponent } from './ui/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ],
  providers: [  ]
})
export class AppRoutingModule {
}
