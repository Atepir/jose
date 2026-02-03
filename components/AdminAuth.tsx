'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';

interface AdminAuthProps {
    children: ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà authentifié
        const token = sessionStorage.getItem('admin_token');
        if (token) {
            verifyToken(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyToken = async (token: string) => {
        try {
            const response = await fetch('/api/admin/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                sessionStorage.removeItem('admin_token');
            }
        } catch {
            sessionStorage.removeItem('admin_token');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                sessionStorage.setItem('admin_token', data.token);
                setIsAuthenticated(true);
            } else {
                setError(data.error || 'Identifiants incorrects');
            }
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Administration KUUNI
                            </h1>
                            <p className="text-gray-600">
                                Connectez-vous pour accéder au panneau d&apos;administration
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom d&apos;utilisateur
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                    placeholder="admin"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition"
                            >
                                Se connecter
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">
                                ← Retour au site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Barre de déconnexion */}
            <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
                <span className="text-sm">Connecté en tant qu&apos;administrateur</span>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded transition"
                >
                    Déconnexion
                </button>
            </div>
            {children}
        </div>
    );
}
