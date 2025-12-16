export type Task = {
  id: number;
  project_id: number;
  content: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  name: string;
  description: string | null;
  tasks: Task[];
  created_at: string;
  updated_at: string;
};
