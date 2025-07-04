// src/components/TaskCard.tsx
import React from 'react';

interface Task {
  id: number;
  name: string;
  status: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="card mb-2">
      <div className="card-body p-2">
        <h6 className="card-title mb-1">{task.name}</h6>
        <small className="text-muted">Statut : {task.status}</small>
      </div>
    </div>
  );
};

export default TaskCard;
