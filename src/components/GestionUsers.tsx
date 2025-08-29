import React, {useEffect, useState} from "react";
import axios from "axios";
import {Project, User} from "../types";
import {API_BASE_URL, useAuth} from "../contexts/AuthContext";

const GestionUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignUserId, setAssignUserId] = useState<number | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null); // reset erreur avant appel
                const [usersRes, projectsRes] = await Promise.all([
                    axios.get<User[]>(`${API_BASE_URL}/users`),
                    axios.get<Project[]>(`${API_BASE_URL}/projects`),
                ]);
                setUsers(usersRes.data);
                setProjects(projectsRes.data);
            } catch (err) {
                const errorMessage =
                    axios.isAxiosError(err) && err.response
                        ? `Erreur: ${err.response.status} ${err.response.statusText}`
                        : "Erreur lors du chargement des données.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const {token} = useAuth();

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            const errorMessage =
                axios.isAxiosError(err) && err.response
                    ? `Erreur: ${err.response.status} ${err.response.statusText}`
                    : "Erreur lors de la suppression de l'utilisateur.";
            setError(errorMessage);
        }
    };


    const handleAssignUser = async () => {
        if (!assignUserId || !selectedProjectId) return;

        try {
            await axios.post(
                `${API_BASE_URL}/user-projects`,
                {
                    id_user: assignUserId,
                    id_project: selectedProjectId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAssignUserId(null);
            setSelectedProjectId(null);
        } catch (err) {
            let errorMessage = "Erreur lors de l'assignation de l'utilisateur.";

            if (axios.isAxiosError(err) && err.response) {
                if (err.response.data?.error) {
                    // Message backend
                    errorMessage = err.response.data.error;
                } else {
                    // Fallback sur status
                    errorMessage = `Erreur: ${err.response.status} ${err.response.statusText}`;
                }
            }

            setError(errorMessage);
        }
    };


    if (isLoading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <table className="w-full mb-6 border">
                <thead className="bg-gray-100">
                <tr>
                    <th className="text-left py-2 px-3">Nom utilisateur</th>
                    <th className="text-left py-2 px-3">Rôle</th>
                    <th className="text-left py-2 px-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-b">
                        <td className="py-2 px-3">{user.name_util}</td>
                        <td className="py-2 px-3">{user.role}</td>
                        <td className="py-2 px-3 space-x-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                onClick={() => setAssignUserId(user.id)}
                            >
                                Assigner à un projet
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal d’assignation */}
            {assignUserId && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">
                            Assigner l’utilisateur à un projet
                        </h3>
                        <select
                            className="border rounded px-2 py-1 mb-4 w-full"
                            value={selectedProjectId ?? ""}
                            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                        >
                            <option value="">Sélectionner un projet</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex space-x-2">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                onClick={handleAssignUser}
                                disabled={!selectedProjectId}
                            >
                                Assigner
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                                onClick={() => {
                                    setAssignUserId(null);
                                    setSelectedProjectId(null);
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionUsers;
