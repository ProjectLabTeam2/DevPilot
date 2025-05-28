import { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            api.get('/users/me')
                .then(res => {
                    setUser(res.data);
                })
                .catch(err => {
                    console.log('Error al cargar perfil:', err);
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/users/login', { username, password });
        const token = res.data.access_token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const profile = await api.get('/users/me');
        setUser(profile.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}