import React, { useState } from 'react';
import { Project, ProjectFormData } from '../types';
import { FolderOpen, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../contexts/AuthContext';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onProjectsChange: () => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  onProjectsChange
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      await axios.post(`${API_BASE_URL}/projects`, data);
      onProjectsChange();
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      setError('Erreur lors de la création du projet');
      console.error('Error creating project:', err);
    }
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (!editingProject) return;

    try {
      await axios.put(`${API_BASE_URL}/projects/${editingProject.id}`, data);
      onProjectsChange();
      setEditingProject(null);
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      setError('Erreur lors de la modification du projet');
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Toutes les tâches associées seront également supprimées.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
      onProjectsChange();
      if (selectedProject?.id === projectId) {
        onProjectSelect(projects.find(p => p.id !== projectId) || projects[0]);
      }
    } catch (err: any) {
      setError('Erreur lors de la suppression du projet');
      console.error('Error deleting project:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      handleUpdateProject(formData);
    } else {
      handleCreateProject(formData);
    }
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || ''
    });
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingProject(null);
    resetForm();
    setIsFormOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
            Projets
          </h2>
          <button
            onClick={openCreateForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedProject?.id === project.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => onProjectSelect(project)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  )}
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditForm(project);
                    }}
                    className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun projet trouvé</p>
            <p className="text-sm mt-1">Créez votre premier projet pour commencer</p>
          </div>
        )}
      </div>

      {/* Formulaire de projet */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du projet *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Entrez le nom du projet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Description du projet (optionnel)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    {editingProject ? (
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
        </div>
      )}
    </>
  );
};

export default ProjectSelector;