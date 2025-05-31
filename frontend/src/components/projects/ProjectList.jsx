import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import './ProjectList.css';
import Swal from 'sweetalert2';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      Swal.fire('Error', 'No se pudo cargar los proyectos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  return (
    <div className="board">
      <header className="board__header">
        <h1>Mis Proyectos</h1>
        <Link to='/projects/new' className="btn btn-primary">
          + Nuevo Proyecto
        </Link>
      </header>
      
      <div className="board__columns">
        {projects.length === 0 ? (
          <div className="board__empty">
            <h3>No tienes proyectos aún</h3>
            <p>Comienza creando tu primer proyecto para organizar tus tareas.</p>
            <Link to='/projects/new' className="btn btn-primary">
              Crear mi primer proyecto
            </Link>
          </div>
        ) : (
          projects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="board__card">
              <h3>{project.title}</h3>
              <p>{project.description || 'Sin descripción'}</p>
              <small>
                Creado: {new Date(project.created_at).toLocaleDateString()}
              </small>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}