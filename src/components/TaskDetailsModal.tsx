import React from 'react';
import {Task} from '../types';
import {X} from 'lucide-react';

interface TaskDetailsModalProps {
    task: Task | null;
    onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({task, onClose}) => {
    if (!task) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">{task.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">{task.description || 'Pas de description disponible.'}</p>
                    <div className="text-sm text-gray-600">
                        <p><strong>Statut :</strong> {task.status}</p>
                        <p><strong>Urgence :</strong> {task.urgency}</p>
                        <p><strong>Importance :</strong> {task.importance}</p>
                        {task.plan_date && <p><strong>Date de planification
                            :</strong> {new Date(task.plan_date).toLocaleDateString('fr-FR')}</p>}
                        {task.estimation &&
                            <p><strong>Estimation :</strong> {task.estimation} {task.estimation_unit}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;