import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

export default function ProjectForm() {
    const { id } = useParams();
    const [form, setForm] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id && id !== 'new') {
            setLoading(true);
            api.get(`/projects/${id}`)
                .then(res => setForm(res.data))
                .catch(err => {
                    console.error('Error al cargar proyecto:', err);
                    alert('Error al cargar proyecto');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!id || id === 'new') {
                await api.post('/projects', form);
            } else {
                await api.put(`/projects/${id}`, form);
            }


            navigate('/projects');
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
            alert('Error al guardar proyecto');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id !== 'new') {
        return <div>Cargando...</div>;
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>{id === 'new' ? 'Crear' : 'Editar'} Proyecto</h2>
                <input
                    name="title"
                    placeholder="Título"
                    value={form.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                    disabled={loading}
                />
                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/projects')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}