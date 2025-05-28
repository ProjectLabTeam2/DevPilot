import { useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContexts';
import './Header.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">ProjectBoard</Link>
      </div>
      {user ? (
        <nav className="header__nav">
          <Link to="/projects" className="header__link">Mis Proyectos</Link>
          <Link to="/projects/new" className="header__link">Nuevo Proyecto</Link>
          <div className="header__user">
            <span>Hola, {user.username}</span>
            <button onClick={handleLogout} className="header__logout">Logout</button>
          </div>
        </nav>
      ) : (
        <nav className="header__nav">
          <Link to="/login" className="header__link">Login</Link>
          <Link to="/register" className="header__link">Registrarse</Link>
        </nav>
      )}
    </header>
  );
}