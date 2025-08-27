import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Matrix from './components/Matrix';
import AdminPanel from './components/AdminPanel';
import GestionUsers from "./components/GestionUsers";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route
                        path="/matrix"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Matrix/>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Layout>
                                    <AdminPanel/>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/gestion-user"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Layout>
                                    <GestionUsers/>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/matrix" replace/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;