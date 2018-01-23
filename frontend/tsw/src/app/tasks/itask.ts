export interface ITask {
  _id?: string;
  name: string;
  description?: string;
  done?: boolean;
  highlighted?: boolean;
  doneAt?: Date;
}
