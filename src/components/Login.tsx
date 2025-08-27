import React, {useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeOff, Lock, User, UserPlus} from 'lucide-react';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name_util: '',
        password: '',
        role: 'util' as 'util' | 'admin'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {login, register} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(formData.name_util, formData.password);
            } else {
                await register(formData.name_util, formData.password, formData.role);
            }
            navigate('/matrix');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">EisenMatrix</h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom d'utilisateur
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="name_util"
                                value={formData.name_util}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Entrez votre nom d'utilisateur"
                                required
                            />
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Entrez votre mot de passe"
                                required
                            />
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rôle
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="util">Utilisateur</option>
                                <option value="admin">Administrateur</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                {isLogin ? <User className="w-5 h-5 mr-2"/> : <UserPlus className="w-5 h-5 mr-2"/>}
                                {isLogin ? 'Se connecter' : 'S\'inscrire'}
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        {isLogin ? 'Pas encore de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;