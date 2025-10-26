export enum PlanCategory {
  PRODUCTIVITY = 'Productivity',
  PHYSICAL = 'Physical',
  MENTAL = 'Mental',
}

export interface PlanItem {
  time: string;
  task: string;
  category: PlanCategory;
  duration: number; // in minutes
  notificationText: string;
  dueDate?: string; // optional property for due date
}