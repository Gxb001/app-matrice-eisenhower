import React, { useState, useEffect } from 'react';
import { User, Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Users, Edit, Trash2, RotateCcw, Shield, UserX, FolderOpen, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name_util: '',
    role: 'util' as 'util' | 'admin'
  });
  const [activeTab, setActiveTab] = useState<'users' | 'projects'>('users');

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(response.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des projets');
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const handleUpdateUserRole = async (userId: number, newRole: 'util' | 'admin') => {
    try {
      await axios.patch(`${API_BASE_URL}/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err: any) {
      setError('Erreur lors de la modification du rôle');
      console.error('Error updating user role:', err);
    }
  };

  const handleRestoreProject = async (projectId: number) => {
    try {
      await axios.patch(`${API_BASE_URL}/projects/${projectId}/restore`);
      fetchProjects();
    } catch (err: any) {
      setError('Erreur lors de la restauration du projet');
      console.error('Error restoring project:', err);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
      fetchProjects();
    } catch (err: any) {
      setError('Erreur lors de la suppression du projet');
      console.error('Error deleting project:', err);
    }
  };

  const handleAssociateUserToProject = async (userId: number, projectId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/user-projects`, {
        user_id: userId,
        project_id: projectId
      });
      // Refresh data if needed
    } catch (err: any) {
      setError('Erreur lors de l\'association utilisateur-projet');
      console.error('Error associating user to project:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600 mt-1">Gestion des utilisateurs et des projets</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Onglets */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Projets
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Utilisateurs</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name_util}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'util' | 'admin')}
                          disabled={user.id === currentUser?.id}
                          className="text-sm border border-gray-300 rounded px-2 py-1 disabled:bg-gray-100"
                        >
                          <option value="util">Utilisateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <FolderOpen className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Projets</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {project.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {project.description || 'Aucune description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          project.deleted_at 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {project.deleted_at ? 'Supprimé' : 'Actif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {project.deleted_at ? (
                            <button
                              onClick={() => handleRestoreProject(project.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                              title="Restaurer"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;