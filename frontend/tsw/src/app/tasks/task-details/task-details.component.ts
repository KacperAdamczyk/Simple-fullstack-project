import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ITask } from '../itask';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  task$: Observable<ITask>;

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

  ngOnInit() {
    this.task$ = this.route.paramMap.switchMap((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        return this.taskService.getOne(id);
      } else {
        return Observable.of(null);
      }
    });
  }

}
