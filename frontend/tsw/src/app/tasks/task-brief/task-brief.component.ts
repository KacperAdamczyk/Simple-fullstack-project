import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ITask } from '../itask';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/operator/switchMap';

@Component({
  selector: 'app-task-brief',
  templateUrl: './task-brief.component.html',
  styleUrls: [ './task-brief.component.scss' ]
})
export class TaskBriefComponent implements OnInit, OnDestroy {
  @HostBinding('class.highlighted') highlighted: boolean;
  @HostBinding('class.task-active') active: boolean;

  @Input() task: ITask;

  @Output() delete = new EventEmitter();

  @HostListener('click', [ '$event' ]) onClick(event) {
    if (event.target !== document.querySelector(`#t${this.task._id} .mat-checkbox-inner-container`)) {
      this.router.navigate([ './', this.task._id ], { relativeTo: this.route });
    }
    //event.stopPropagation();
  }

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.highlighted = this.task.highlighted;
    this.route.paramMap.subscribe((params) => {
      this.active = params.get('id') === this.task._id;
    });
    document.querySelector('body').addEventListener('click', () => this.router.navigate([ '/tasks' ]));
  }

  ngOnDestroy() {
    document.querySelector('body').removeEventListener('click', () => this.router.navigate([ '/tasks' ]));
  }

  checkboxChange(event) {
    const state = event.checked;
    this.task.done = state;
    this.task.doneAt = state ? new Date() : null;
    this.taskService.update(this.task)
      .catch(() => this.router.navigate([ '/error' ]));
  }

  onDelete(event) {
    event.stopPropagation();
    this.taskService.delete(this.task._id).then(() => this.delete.emit(),
      () => this.router.navigate([ '/error' ]));
  }
}
