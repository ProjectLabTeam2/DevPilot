import { useEffect, useState } from 'react';
import api from '../../api/api';
import TaskForm from './TaskForm';
import './TaskList.css';
import Swal from 'sweetalert2';

export default function TaskList({ projectId, isManager }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      const projectTasks = res.data.filter(t => t.project_id === parseInt(projectId));
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      Swal.fire('Error', 'No se pudieron cargar las tareas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleTaskSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la tarea de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tasks/${taskId}`);
        await Swal.fire('¡Eliminada!', 'La tarea ha sido eliminada.', 'success');
        fetchTasks();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        Swal.fire('Error', 'No se pudo eliminar la tarea.', 'error');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'Error al actualizar estado', 'error');
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
        {isManager && (
          <button 
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            + Añadir Tarea
          </button>
        )}
      </div>

      {(showForm || editingTask) && (
        <TaskForm 
          projectId={projectId}
          task={editingTask}
          onSuccess={handleTaskSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
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

                <div className="dropdown">
                  <button className="task-menu-btn" title="Opciones">⋮</button>
                  <div className="dropdown-content">
                    <button onClick={() => {
                      setEditingTask(task);
                      setShowForm(true);
                    }}>Editar</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
                  </div>
                </div>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-card__footer">
                <small>Prioridad: {getPriorityText(task.priority)}</small>
                {task.due_date && (
                  <small>Vence: {new Date(task.due_date).toLocaleDateString()}</small>
                )}
                {task.owner && (
                  <small>Asignado a: {task.owner.username}</small>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
