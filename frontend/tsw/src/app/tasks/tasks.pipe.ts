import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from './itask';

@Pipe({
  name: 'tasks'
})
export class TasksPipe implements PipeTransform {

  transform(value: ITask[], filter: string): ITask[] | null {
    if (!(value instanceof Array)) {
      return;
    }
    switch (filter) {
      case 'done':
        return value.filter((val) => val.done);
      case 'highlighted':
        return value.filter((val) => val.highlighted);
      default:
        return value;
    }
  }

}
