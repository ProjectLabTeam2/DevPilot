import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import TaskList from '../tasks/TaskList';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error('Error al cargar proyecto:', error);
      alert('Error al cargar proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Se eliminarán todas las tareas asociadas.')) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        alert('Error al eliminar proyecto');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="detail-container">
      <header className="detail-header">
        <h1>{project.title}</h1>
        <div className="detail-actions">
          <Link to={`/projects/${id}/edit`} className="btn btn-primary">
            Editar
          </Link>
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Eliminar
          </button>
          <Link to="/projects" className="btn btn-secondary">
            Volver a Proyectos
          </Link>
        </div>
      </header>
      <div className="detail-content">
        <p><strong>Descripción:</strong> {project.description}</p>
        <p><strong>Creado:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
      </div>
      <TaskList projectId={id} />
    </div>
  );
}