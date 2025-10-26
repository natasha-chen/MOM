export enum PlanCategory {
  PRODUCTIVITY = 'Productivity',
  PHYSICAL = 'Physical',
  MENTAL = 'Mental',
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface PlanItem {
  time: string;
  task: string;
  category: PlanCategory;
  duration: number; // in minutes
  notificationText: string;
  dueDate?: string; // optional property for due date
  status: TaskStatus; // task status
}