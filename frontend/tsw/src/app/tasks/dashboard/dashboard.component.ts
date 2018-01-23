import { Component, HostBinding, OnInit } from '@angular/core';
import { ITask } from '../itask';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks$: Observable<ITask[]>;
  filterOptions = [
    { value: 'full', displayValue: 'Wszystko' },
    { value: 'done', displayValue: 'Zakończone' },
    { value: 'highlighted', displayValue: 'Wyróżnione' }
  ];
  filterOption = 'full';

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.tasks$ = <Observable<ITask[]>>this.taskService.getTasksForUser();
  }
}
