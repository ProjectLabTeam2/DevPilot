import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import Swal from 'sweetalert2';
import './ProjectForm.css';

export default function ProjectForm() {
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api.get(`/projects/${id}`)
        .then(res => {
          setForm({
            title: res.data.title || '',
            description: res.data.description || ''
          });
        })
        .catch(err => {
          console.error('Error al cargar proyecto:', err);
          Swal.fire('Error', 'No se pudo cargar el proyecto.', 'error');
          navigate('/projects'); // volver si no se encuentra o no tiene permiso
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/projects/${id}`, form);
        Swal.fire('Éxito', 'Proyecto actualizado.', 'success');
      } else {
        await api.post('/projects', form);
        Swal.fire('Éxito', 'Proyecto creado.', 'success');
      }
      navigate('/projects');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      Swal.fire('Error', 'No se pudo guardar el proyecto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">{isEditing ? 'Editar' : 'Crear'} Proyecto</h2>

        <div>
          <label htmlFor="title" className="label">Título</label>
          <input
            id="title"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            disabled={loading}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">Descripción</label>
          <textarea
            id="description"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
            className="textarea"
          />
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            disabled={loading}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
