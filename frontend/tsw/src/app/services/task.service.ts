import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { ITask } from '../tasks/itask';
import { IResponse } from '../shared/iresponse';

const baseUrl = environment.production ? '' : 'http://localhost:8080/';

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getTasksForUser() {
    return this.http.get<IResponse>(baseUrl + 'tasks', { withCredentials: true }).map(data => <any>data.message);
  }

  getOne(id: string) {
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
    const taskToSend = {
      _id: task._id,
      name: task.name,
      description: task.description,
      highlighted: task.highlighted,
      done: task.done,
      doneAt: task.done ? task.doneAt.getTime() : null
    };
    return this.http.put<IResponse>(baseUrl + 'tasks', taskToSend, { withCredentials: true }).toPromise();
  }

  delete(id: string) {
    return this.http.delete<IResponse>(baseUrl + `tasks/${id}`, { withCredentials: true }).toPromise();
  }
}
