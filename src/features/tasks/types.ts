export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
};