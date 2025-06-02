import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './Taskform.css';
import Swal from 'sweetalert2';

export default function TaskForm({ projectId, task, onSuccess, onCancel }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    owner_id: ''
  });

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  // Cargar miembros del proyecto
  useEffect(() => {
    api.get(`/projects/${projectId}`)
      .then(res => {
        setMembers(res.data.all_users || []);
      })
      .catch(() => Swal.fire('Error', 'No se pudieron cargar miembros', 'error'));
  }, [projectId]);

  // Cuando cambia la tarea que editamos, cargar datos en el formulario
  useEffect(() => {
    if (task) {
      setForm({
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        owner_id: task.owner ? String(task.owner.id) : ''
      });
    } else {
      // Limpiar formulario si no hay tarea (modo creación)
      setForm({
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        owner_id: ''
      });
    }
  }, [task]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        ...form,
        project_id: parseInt(projectId),
        owner_id: form.owner_id ? parseInt(form.owner_id) : undefined
      };

      if (!taskData.due_date) delete taskData.due_date;
      if (!taskData.owner_id) delete taskData.owner_id;

      if (task && task.id) {
        // Edición
        await api.put(`/tasks/${task.id}`, taskData);
        Swal.fire('¡Éxito!', 'La tarea fue actualizada.', 'success');
      } else {
        // Creación
        await api.post('/tasks', taskData);
        Swal.fire('¡Éxito!', 'La tarea fue creada.', 'success');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      Swal.fire('Error', 'No se pudo guardar la tarea.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-overlay">
      <form className="task-form" onSubmit={handleSubmit}>
        <h3>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h3>

        <textarea
          name="description"
          placeholder="Descripción de la tarea"
          value={form.description}
          onChange={handleChange}
          required
          disabled={loading}
          rows={3}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="done">Completada</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>

        <select
          name="owner_id"
          value={form.owner_id}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Asignar a...</option>
          {members.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>

        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          disabled={loading}
          min={today}
          max="2100-12-31"
          placeholder="Fecha de vencimiento (opcional)"
        />

        <div className="task-form__actions">
          <button type="submit" disabled={loading}>
            {loading ? (task ? 'Guardando...' : 'Creando...') : (task ? 'Guardar Cambios' : 'Crear Tarea')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
