import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import axios from 'axios';

interface User {
    id: number;
    name_util: string;
    role: 'util' | 'admin';
    created_at?: string;
    deleted_at?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (name_util: string, password: string) => Promise<void>;
    register: (name_util: string, password: string, role: 'util' | 'admin') => Promise<void>;
    logout: () => void;
    isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// Configuration de l'API base URL
export const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Décoder le token JWT pour obtenir les informations utilisateur
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    id: payload.user_id || payload.sub,
                    name_util: payload.name_util || payload.username,
                    role: payload.role || 'util',
                    created_at: payload.created_at || new Date().toISOString()
                });
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                setToken(null);
            }
        }
    }, [token]);

    const login = async (name_util: string, password: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                name_util,
                password
            });

            const {access_token, user_id} = response.data;
            localStorage.setItem('token', access_token);
            setToken(access_token);

            // Décoder le token pour obtenir les infos utilisateur
            const payload = JSON.parse(atob(access_token.split('.')[1]));
            setUser({
                id: user_id,
                name_util: payload.name_util || name_util,
                role: payload.role || 'util',
                created_at: new Date().toISOString()
            });
        } catch (error: any) {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.';
            throw new Error(message);
        }
    };

    const register = async (name_util: string, password: string, role: 'util' | 'admin' = 'util') => {
        try {
            await axios.post(`${API_BASE_URL}/register`, {
                name_util,
                password,
                role
            });

            // Connexion automatique après inscription
            await login(name_util, password);
        } catch (error: any) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'Échec de l\'inscription. Le nom d\'utilisateur existe peut-être déjà.';
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{user, token, login, register, logout, isAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};

// Configuration d'axios pour inclure le token dans les requêtes
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);