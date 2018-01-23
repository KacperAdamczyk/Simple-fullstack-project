import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ITask } from '../itask';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: [ './add-edit-task.component.scss' ]
})
export class AddEditTaskComponent implements OnInit, OnDestroy {
  form: FormGroup;
  newTask = true;
  task$: Observable<ITask | null>;
  task: ITask;
  taskSub: Subscription = null;

  constructor(private fb: FormBuilder, private taskService: TaskService, private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.task$ = this.route.paramMap.switchMap((params: ParamMap) => {
      const id = params.get('id');
      this.newTask = !id;
      if (!this.newTask) {
        return this.taskService.getOne(id);
      } else {
        return of(null);
      }
    });
      this.taskSub = this.task$.subscribe((task) => this.fillForm(task));
  }

  ngOnDestroy() {
      this.taskSub.unsubscribe();
  }

  fillForm(task: ITask) {
    if (!task) {
      return;
    }
    this.task = task;
    this.task.doneAt = new Date(task.doneAt);
    this.form.patchValue(task);
  }

  createForm() {
    this.form = this.fb.group({
      name: [ '', Validators.required ],
      description: '',
      highlighted: false,
    });
  }

  add() {
    const name = this.form.get('name').value;
    const desc = this.form.get('description').value;
    const highlighted = this.form.get('highlighted').value;
    this.taskService.add(name, desc, highlighted)
      .then(() => this.router.navigate([ '/tasks' ]),
        (err) => {
          this.router.navigate([ '/error' ]);
        });
  }

  edit() {
    this.task.name = this.form.get('name').value;
    this.task.description = this.form.get('description').value;
    this.task.highlighted = this.form.get('highlighted').value;
    this.taskService.update(this.task)
      .then(() => this.router.navigate([ '/tasks' ]),
        (err) => {
          this.router.navigate([ '/error' ]);
        });
  }
}
