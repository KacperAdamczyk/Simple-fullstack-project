import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ITask } from '../itask';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs/Observable';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  filterOptions = [
    { value: 'full', displayValue: 'Wszystko' },
    { value: 'done', displayValue: 'Zakończone' },
    { value: 'highlighted', displayValue: 'Wyróżnione' }
  ];
  filterOption = 'full';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private taskService: TaskService, private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    document.querySelector('body').addEventListener('click', () => this.router.navigate([ '/tasks' ]));
  }

  ngOnDestroy() {
    document.querySelector('body').removeEventListener('click', () => this.router.navigate([ '/tasks' ]));
  }

  getTasks() {
    return this.taskService.getTasks();
  }

  updateTasks() {
    this.taskService.updateTasks();
  }
}
