export enum TaskCategory {
  WORK = 'WORK',
  STUDY = 'STUDY',
  PERSONAL = 'PERSONAL',
  CODING = 'CODING'
}

export class Task {
  completed: boolean = false;
  
  constructor(
    public time: string,
    public description: string,
    public category: TaskCategory
  ) {}
  
  toggle() {
    this.completed = !this.completed;
  }
}
