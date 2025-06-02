import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import TaskList from '../tasks/TaskList';
import InviteForm from '../users/InviteUsersForm';
import './ProjectDetail.css';
import Swal from 'sweetalert2';

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
      Swal.fire('Error', 'No se pudo cargar el proyecto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todas las tareas asociadas a este proyecto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/projects/${id}`);
        await Swal.fire('¡Eliminado!', 'El proyecto ha sido eliminado.', 'success');
        navigate('/projects');
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        Swal.fire('Error', 'No se pudo eliminar el proyecto.', 'error');
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
          <Link to={`/projects/${id}/edit`} className="btn btn-primary">Editar</Link>
          <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
          <Link to="/projects" className="btn btn-secondary">Volver a Proyectos</Link>
        </div>
      </header>

      <div className="detail-content">
        <p><strong>Descripción:</strong> {project.description}</p>
        <p><strong>Creado:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
      </div>

      <TaskList projectId={id} isManager={project.is_manager} />
      {project.is_manager && <InviteForm projectId={id} />}
    </div>
  );
}
