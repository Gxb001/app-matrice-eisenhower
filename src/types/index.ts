export interface Task {
  id: number;
  name: string;
  description?: string;
  urgency: 'Urgent' | 'Non Urgent';
  importance: 'Important' | 'Non Important';
  status: 'En cours' | 'Planifié' | 'Bloqué' | 'À faire';
  plan_date?: string;
  estimation?: number;
  estimation_unit?: string;
  id_project: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface User {
  id: number;
  name_util: string;
  role: 'util' | 'admin';
  created_at?: string;
  deleted_at?: string;
}

export interface TaskFormData {
  name: string;
  description?: string;
  urgency: 'Urgent' | 'Non Urgent';
  importance: 'Important' | 'Non Important';
  status: 'En cours' | 'Planifié' | 'Bloqué' | 'À faire';
  plan_date?: string;
  estimation?: number;
  estimation_unit?: string;
  id_project: number;
}

export interface ProjectFormData {
  name: string;
  description?: string;
}

export interface MatrixData {
  urgent_important: Task[];
  urgent_non_important: Task[];
  non_urgent_important: Task[];
  non_urgent_non_important: Task[];
}

export interface TaskStats {
  by_quadrant: {
    urgent_important: number;
    urgent_non_important: number;
    non_urgent_important: number;
    non_urgent_non_important: number;
  };
  by_status: {
    'En cours': number;
    'Planifié': number;
    'Bloqué': number;
    'À faire': number;
  };
  by_project: Record<string, number>;
}