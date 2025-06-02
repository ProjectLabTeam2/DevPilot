import { useState, useEffect, useRef } from 'react';
import api from '../../api/api';
import Swal from 'sweetalert2';
import './InviteForm.css';

export default function InviteForm({ projectId }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    api.get('/users/get')
      .then(res => setUsers(res.data))
      .catch(() => Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error'));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(u =>
      u.username.toLowerCase().includes(term) &&
      !selectedUsers.some(su => su.id === u.id)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users, selectedUsers]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm('');
    setFilteredUsers([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleInvite = async () => {
    if (selectedUsers.length === 0) {
      Swal.fire('Atención', 'Selecciona al menos un usuario para invitar.', 'info');
      return;
    }
    try {
      const userIds = selectedUsers.map(u => u.id);
      const res = await api.post(`/projects/${projectId}/invite`, { user_ids: userIds });
      Swal.fire('Éxito', Object.values(res.data).join('\n'), 'success');
      setSelectedUsers([]);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error al invitar usuarios';
      Swal.fire('Error', msg, 'error');
    }
  };

  return (
    <div className="invite-form">
      <h4>Invitar Usuarios</h4>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoComplete="off"
          ref={inputRef}
        />
        {filteredUsers.length > 0 && (
          <ul className="autocomplete-list">
            {filteredUsers.map(user => (
              <li
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="autocomplete-item"
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="selected-users">
        {selectedUsers.map(user => (
          <span key={user.id} className="selected-user-chip">
            {user.username}
            <button
              type="button"
              onClick={() => handleRemoveUser(user.id)}
              className="remove-btn"
              aria-label={`Quitar ${user.username}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <button onClick={handleInvite} className="btn btn-primary invite-btn">
        Invitar
      </button>
    </div>
  );
}
