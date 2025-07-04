// src/components/Quadrant.tsx
import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';

interface Task {
  id: number;
  name: string;
  status: string;
}

interface QuadrantProps {
  title: string;
  urgency: boolean | number | string; // adapte selon ton usage réel
  importance: boolean | number | string; // idem
  userId: string | number;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, urgency, importance, userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Pour test : données mockées (à remplacer avec fetch API réelle)
    const mockData: Task[] = [
      { id: 1, name: 'Tâche A', status: 'à faire' },
      { id: 2, name: 'Tâche B', status: 'planifié' },
    ];
    setTasks(mockData);
  }, [urgency, importance, userId]);

  return (
    <div className="border rounded p-3 shadow-sm bg-light h-100 d-flex flex-column">
      <h5 className="fw-bold text-center mb-3">{title}</h5>
      <div className="flex-grow-1 overflow-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <button className="btn btn-primary mt-3">+ Ajouter une tâche</button>
    </div>
  );
};

export default Quadrant;
