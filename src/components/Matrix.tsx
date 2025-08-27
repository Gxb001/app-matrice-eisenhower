import React, {useEffect, useState} from 'react';
import {MatrixData, Project, Task, TaskFormData} from '../types';
import {API_BASE_URL, useAuth} from '../contexts/AuthContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import ProjectSelector from './ProjectSelector';
import {AlertCircle, Archive, CheckCircle, Clock, FolderOpen, Plus} from 'lucide-react';
import axios from 'axios';

const Matrix: React.FC = () => {
    const [matrixData, setMatrixData] = useState<MatrixData>({
        urgent_important: [],
        urgent_non_important: [],
        non_urgent_important: [],
        non_urgent_non_important: []
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const {user} = useAuth();

    const fetchProjects = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/users/${user.id}/projects`);
            setProjects(response.data);
            if (response.data.length > 0 && !selectedProject) {
                setSelectedProject(response.data[0]);
            }
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            setError('Erreur lors du chargement des projets');
        }
    };

    const fetchMatrixData = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/tasks/matrix/${user.id}`);
            setMatrixData(response.data);
        } catch (err: any) {
            setError('Erreur lors du chargement de la matrice');
            console.error('Error fetching matrix data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProjects();
            fetchMatrixData();
        }
    }, [user]);

    useEffect(() => {
        if (selectedProject) {
            fetchMatrixData();
        }
    }, [selectedProject]);

    const handleCreateTask = async (formData: TaskFormData) => {
        if (!user || !selectedProject) return;

        try {
            await axios.post(`${API_BASE_URL}/tasks`, {
                ...formData,
                id_project: selectedProject.id
            });
            fetchMatrixData();
        } catch (err: any) {
            setError('Erreur lors de la création de la tâche');
            console.error('Error creating task:', err);
        }
    };

    const handleUpdateTask = async (formData: TaskFormData) => {
        if (!editingTask) return;

        try {
            await axios.put(`${API_BASE_URL}/tasks/${editingTask.id}`, formData);
            setEditingTask(null);
            fetchMatrixData();
        } catch (err: any) {
            setError('Erreur lors de la modification de la tâche');
            console.error('Error updating task:', err);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
            fetchMatrixData();
        } catch (err: any) {
            setError('Erreur lors de la suppression de la tâche');
            console.error('Error deleting task:', err);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (formData: TaskFormData) => {
        if (editingTask) {
            handleUpdateTask(formData);
        } else {
            handleCreateTask(formData);
        }
    };

    const getQuadrantConfig = (quadrant: keyof MatrixData) => {
        const configs = {
            urgent_important: {
                title: 'Urgent & Important',
                subtitle: 'Faire en premier',
                color: 'bg-red-50 border-red-200',
                headerColor: 'bg-red-500',
                icon: AlertCircle
            },
            non_urgent_important: {
                title: 'Non Urgent & Important',
                subtitle: 'Planifier',
                color: 'bg-green-50 border-green-200',
                headerColor: 'bg-green-500',
                icon: CheckCircle
            },
            urgent_non_important: {
                title: 'Urgent & Non Important',
                subtitle: 'Déléguer',
                color: 'bg-orange-50 border-orange-200',
                headerColor: 'bg-orange-500',
                icon: Clock
            },
            non_urgent_non_important: {
                title: 'Non Urgent & Non Important',
                subtitle: 'Éliminer',
                color: 'bg-gray-50 border-gray-200',
                headerColor: 'bg-gray-500',
                icon: Archive
            }
        };
        return configs[quadrant];
    };

    const QuadrantCard = ({quadrant}: { quadrant: keyof MatrixData }) => {
        const quadrantTasks = matrixData[quadrant];
        const config = getQuadrantConfig(quadrant);
        const IconComponent = config.icon;

        return (
            <div className={`rounded-xl border-2 ${config.color} h-full flex flex-col`}>
                <div className={`${config.headerColor} text-white px-4 py-3 rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <IconComponent className="w-5 h-5 mr-2"/>
                            <div>
                                <h3 className="font-semibold text-sm">{config.title}</h3>
                                <p className="text-xs opacity-90">{config.subtitle}</p>
                            </div>
                        </div>
                        <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
              {quadrantTasks.length}
            </span>
                    </div>
                </div>

                <div className="flex-1 p-4">
                    <div className="space-y-3">
                        {quadrantTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                        {quadrantTasks.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">Aucune tâche dans ce quadrant</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de la matrice...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Matrice d'Eisenhower</h1>
                            <p className="text-gray-600 mt-1">Organisez vos tâches par priorité</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {selectedProject && (
                                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border">
                                    <FolderOpen className="w-5 h-5 text-blue-600 mr-2"/>
                                    <span className="font-medium text-gray-900">{selectedProject.name}</span>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setIsFormOpen(true);
                                }}
                                disabled={!selectedProject}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-5 h-5 mr-2"/>
                                Nouvelle tâche
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                            {error}
                        </div>
                    )}

                    {projects.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 mb-6">
                            <p>Aucun projet trouvé. Vous devez être associé à un projet pour voir les tâches.</p>
                        </div>
                    )}
                </div>

                {/* Sélecteur de projet */}
                <ProjectSelector
                    projects={projects}
                    selectedProject={selectedProject}
                    onProjectSelect={setSelectedProject}
                    onProjectsChange={fetchProjects}
                />

                {/* Grille de la matrice */}
                {selectedProject && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px] mt-6">
                        <QuadrantCard quadrant="urgent_important"/>
                        <QuadrantCard quadrant="non_urgent_important"/>
                        <QuadrantCard quadrant="urgent_non_important"/>
                        <QuadrantCard quadrant="non_urgent_non_important"/>
                    </div>
                )}
            </div>

            <TaskForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleFormSubmit}
                editingTask={editingTask}
                selectedProject={selectedProject}
            />
        </div>
    );
};

export default Matrix;