import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StopClickEventPropagationDirective } from '../stop-click-event-propagation.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    HttpClientModule,
    StopClickEventPropagationDirective
  ],
  declarations: [
    StopClickEventPropagationDirective
  ]
})
export class SharedModule { }
