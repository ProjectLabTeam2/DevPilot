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
      if (!id || id === 'new') await api.post('/projects', form);
      else await api.put(`/projects/${id}`, form);
      navigate('/projects');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      alert('Error al guardar proyecto');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id !== 'new') {
    return (
      <div style={styles.loaderContainer}>
        <span style={styles.loaderText}>Cargando...</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>{id === 'new' ? 'Crear' : 'Editar'} Proyecto</h2>

        <div>
          <label htmlFor="title" style={styles.label}>Título</label>
          <input
            id="title"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            disabled={loading}
            style={styles.input}
          />
        </div>

        <div>
          <label htmlFor="description" style={styles.label}>Descripción</label>
          <textarea
            id="description"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
            style={styles.textarea}
          />
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f7fa',
    padding: '16px',
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#333333',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#555555',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  loaderText: {
    fontSize: '18px',
    color: '#777777',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};