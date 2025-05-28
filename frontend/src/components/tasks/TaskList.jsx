import { useEffect, useState } from 'react';
import api from '../../api/api';
import TaskForm from './TaskForm';
import './TaskList.css';

export default function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      const projectTasks = res.data.filter(t => t.project_id === parseInt(projectId));
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleTaskSuccess = () => {
    setShowForm(false);
    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar tarea');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#28a745';
      case 'in_progress': return '#ffc107';
      case 'pending': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done': return 'Completada';
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  if (loading) return <div>Cargando tareas...</div>;

  return (
    <div className="tasks">
      <div className="tasks__header">
        <h3>Tareas ({tasks.length})</h3>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Añadir Tarea
        </button>
      </div>

      {showForm && (
        <TaskForm 
          projectId={projectId} 
          onSuccess={handleTaskSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="tasks__list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No hay tareas en este proyecto</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-card__header">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="task-status"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="done">Completada</option>
                </select>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="task-delete"
                  aria-label="Eliminar tarea"
                >
                  ×
                </button>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-card__footer">
                <small>Prioridad: {getPriorityText(task.priority)}</small>
                {task.due_date && (
                  <small>Vence: {new Date(task.due_date).toLocaleDateString()}</small>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}