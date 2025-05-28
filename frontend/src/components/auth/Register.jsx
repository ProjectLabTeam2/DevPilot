import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/register', form);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error al registrar. Intenta con otros datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        <input 
          name="username" 
          placeholder="Usuario" 
          value={form.username} 
          onChange={handleChange} 
          required 
          disabled={loading}
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Correo electrónico" 
          value={form.email} 
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
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}