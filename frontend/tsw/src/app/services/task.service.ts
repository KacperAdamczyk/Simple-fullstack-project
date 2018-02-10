import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { ITask } from '../tasks/itask';
import { IResponse } from '../shared/iresponse';
import { Observable } from 'rxjs/Observable';

const baseUrl = environment.production ? '' : 'http://localhost:8080/';

@Injectable()
export class TaskService {
  tasks$: Observable<ITask>;
  currentTaskId: string = null;

  constructor(private http: HttpClient) {
    this.updateTasks();
  }

  updateTasks() {
    this.tasks$ = this.getTasksForUser();
  }

  getTasks() {
    return this.tasks$;
  }

  getTasksForUser() {
    return this.http.get<IResponse>(baseUrl + 'tasks', { withCredentials: true }).map(data => <any>data.message);
  }

  getOne(id: string) {
    this.currentTaskId = id;
    return this.http.get<IResponse>(baseUrl + `tasks/${id}`, { withCredentials: true }).map(data => <any>data.message);
  }

  add(name: string, description: string, highlighted: boolean = false): Promise<any> {
    return this.http.post<IResponse>(baseUrl + 'tasks', {
      name,
      description,
      highlighted
    }, {
      withCredentials: true
    }).toPromise();
  }

  update(task: ITask): Promise<IResponse> {
    function convertDate(date) {
      if (date instanceof Date) {
        return date.getTime();
      } else if (date instanceof Number) {
        return date;
      }
    }

    const taskToSend = {
      _id: task._id,
      name: task.name,
      description: task.description,
      highlighted: task.highlighted,
      done: task.done,
      doneAt: task.done ? convertDate(task.doneAt) : null
    };
    return this.http.put<IResponse>(baseUrl + 'tasks', taskToSend, { withCredentials: true }).toPromise();
  }

  delete(id: string) {
    return this.http.delete<IResponse>(baseUrl + `tasks/${id}`, { withCredentials: true }).toPromise();
  }
}
