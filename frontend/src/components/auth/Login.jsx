import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContexts';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input 
          name="username" 
          placeholder="Usuario" 
          value={form.username} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Contraseña" 
          value={form.password} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}