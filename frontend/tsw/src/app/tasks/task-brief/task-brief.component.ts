import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { ITask } from '../itask';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-brief',
  templateUrl: './task-brief.component.html',
  styleUrls: [ './task-brief.component.scss' ]
})
export class TaskBriefComponent implements OnInit {
  @HostBinding('class.highlighted') highlighted: boolean;

  @Input() task: ITask;

  @Output() delete = new EventEmitter();

  @HostListener('click', ['$event']) onClick(event) {
    if (event.path.length === 15) {
      this.router.navigate([ '/task', this.task._id ]);
    }
  }

  constructor(private taskService: TaskService, private router: Router) {
  }

  ngOnInit() {
    this.highlighted = this.task.highlighted;
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
