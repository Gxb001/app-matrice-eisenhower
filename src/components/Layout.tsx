import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Shield, Grid3X3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="bg-blue-600 rounded-lg p-2 mr-3">
                  <Grid3X3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EisenMatrix</span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/matrix')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/matrix')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Matrice
                </button>
                
                {isAdmin() && (
                  <button
                    onClick={() => navigate('/admin')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      isActive('/admin')
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Administration
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name_util}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};

export default Layout;