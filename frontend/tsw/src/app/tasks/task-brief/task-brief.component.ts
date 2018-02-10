import {
  ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { ITask } from '../itask';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

import 'rxjs/operator/switchMap';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-task-brief',
  templateUrl: './task-brief.component.html',
  styleUrls: [ './task-brief.component.scss' ]
})
export class TaskBriefComponent implements OnInit, OnDestroy {
  @HostBinding('class.task-brief--highlighted') highlighted: boolean;

  @Input() task: ITask;

  @Output() delete = new EventEmitter();

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  get isActivated() {
    return this.router.url.includes(this.task._id);
  }

  constructor(private taskService: TaskService, private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.highlighted = this.task.highlighted;
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  checkboxChange(event) {
    const state = event.checked;
    this.task.done = state;
    this.task.doneAt = state ? new Date() : null;
    this.taskService.update(this.task)
      .catch(() => this.router.navigate([ '/error' ]));
  }

  onDelete() {
    this.taskService.delete(this.task._id).then(() => this.delete.emit(),
      () => this.router.navigate([ '/error' ]));
  }

  getPath() {
    return this.mobileQuery.matches ? ['/edit', this.task._id] : ['./', this.task._id];
  }
}
