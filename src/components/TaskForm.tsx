import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, Project } from '../types';
import { X, Save, Plus } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  editingTask?: Task | null;
  selectedProject: Project | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, editingTask, selectedProject }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    urgency: 'Non Urgent',
    importance: 'Important',
    status: 'À faire',
    plan_date: '',
    estimation: undefined,
    estimation_unit: 'heures',
    id_project: selectedProject?.id || 0
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        name: editingTask.name,
        description: editingTask.description || '',
        urgency: editingTask.urgency,
        importance: editingTask.importance,
        status: editingTask.status,
        plan_date: editingTask.plan_date || '',
        estimation: editingTask.estimation || undefined,
        estimation_unit: editingTask.estimation_unit || 'heures',
        id_project: editingTask.id_project
      });
    } else {
      setFormData({
        name: '',
        description: '',
        urgency: 'Non Urgent',
        importance: 'Important',
        status: 'À faire',
        plan_date: '',
        estimation: undefined,
        estimation_unit: 'heures',
        id_project: selectedProject?.id || 0
      });
    }
  }, [editingTask, isOpen, selectedProject]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimation' ? (value ? Number(value) : undefined) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation pour les tâches Non Urgent & Important
    if (formData.urgency === 'Non Urgent' && formData.importance === 'Important' && !formData.plan_date) {
      alert('La date de planification est obligatoire pour les tâches Non Urgent & Important');
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Entrez le titre de la tâche"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Description de la tâche (optionnel)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgence *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="Urgent">Urgent</option>
                <option value="Non Urgent">Non Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Importance *
              </label>
              <select
                name="importance"
                value={formData.importance}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="Important">Important</option>
                <option value="Non Important">Non Important</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Planifié">Planifié</option>
              <option value="Bloqué">Bloqué</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de planification
              {formData.urgency === 'Non Urgent' && formData.importance === 'Important' && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type="date"
              name="plan_date"
              value={formData.plan_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required={formData.urgency === 'Non Urgent' && formData.importance === 'Important'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimation
              </label>
              <input
                type="number"
                name="estimation"
                value={formData.estimation || ''}
                onChange={handleInputChange}
                min="0"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="ex: 2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unité
              </label>
              <select
                name="estimation_unit"
                value={formData.estimation_unit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="heures">Heures</option>
                <option value="jours">Jours</option>
                <option value="semaines">Semaines</option>
                <option value="mois">Mois</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              {editingTask ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Modifier
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;