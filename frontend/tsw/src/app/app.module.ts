import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from './ui/ui.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared/shared.module';
import { TasksModule } from './tasks/tasks.module';
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from './services/task.service';
import { AppRoutingModule } from './app-routing.module';
import { CookieLawModule } from 'angular2-cookie-law';
import { StopClickEventPropagationDirective } from './shared/stop-click-event-propagation.directive';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    UiModule,
    UserModule,
    TasksModule,
    CookieLawModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    UserService,
    TaskService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
