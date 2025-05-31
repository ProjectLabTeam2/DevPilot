import React, { useState } from 'react';
import api from '../../api/api';
import './Taskform.css';
import Swal from 'sweetalert2';

export default function TaskForm({ projectId, onSuccess, onCancel }) {
  const [form, setForm] = useState({ 
    description: '', 
    status: 'pending', 
    priority: 'medium',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const taskData = {
        ...form,
        project_id: parseInt(projectId)
      };
      
      if (!taskData.due_date) {
        delete taskData.due_date;
      }
      
      console.log('Creando tarea con:', taskData);

      await api.post('/tasks', taskData);
      onSuccess();
    } catch (error) {
      console.error('Error al crear tarea:', error);
      Swal.fire('Error al crear tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-overlay">
      <form className="task-form" onSubmit={handleSubmit}>
        <h3>Nueva Tarea</h3>
        
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

        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          disabled={loading}
          placeholder="Fecha de vencimiento (opcional)"
        />
        
        <div className="task-form__actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Tarea'}
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
