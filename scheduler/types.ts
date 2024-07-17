export interface Task {
  id: string;
  type: string;
  name: string;
  schedule: string;
  status: 'pending' | 'scheduled' | 'completed';
  [key: string]: any; // To allow additional properties
}
