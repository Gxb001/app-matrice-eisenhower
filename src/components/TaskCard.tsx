import React from 'react';
import {Task} from '../types';
import {Calendar, Clock, Edit, Tag, Trash2, User} from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task, onEdit, onDelete}) => {
    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'En cours':
                return 'bg-blue-100 text-blue-800';
            case 'Planifié':
                return 'bg-green-100 text-green-800';
            case 'Bloqué':
                return 'bg-red-100 text-red-800';
            case 'À faire':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatEstimation = (estimation?: number, unit?: string) => {
        if (!estimation) return null;
        return `${estimation} ${unit || 'heures'}`;
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{task.name}</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="Modifier"
                    >
                        <Edit className="w-4 h-4"/>
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
                <span
                    className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center">
          <Tag className="w-3 h-3 mr-1"/>
                    {task.urgency} & {task.importance}
        </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                {task.plan_date && (
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2"/>
                        <span>Planifié pour le {formatDate(task.plan_date)}</span>
                    </div>
                )}

                {task.estimation && (
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2"/>
                        <span>Estimation: {formatEstimation(task.estimation, task.estimation_unit)}</span>
                    </div>
                )}
            </div>

            {task.created_at && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1"/>
                        <span>Créé le {formatDate(task.created_at)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;