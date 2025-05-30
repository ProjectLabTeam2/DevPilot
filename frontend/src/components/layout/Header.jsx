import { useContext, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContexts';
import './Header.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLinkClick = () => setOpen(false);

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/" onClick={handleLinkClick}>ProjectBoard</Link>
      </div>
      <button 
        className={`header__burger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`header__nav ${open ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/projects" className="header__link" onClick={handleLinkClick}>Mis Proyectos</Link>
            <Link to="/projects/new" className="header__link" onClick={handleLinkClick}>Nuevo Proyecto</Link>
            <div className="header__user">
              <span>Hola, {user.username}</span>
              <button onClick={handleLogout} className="header__logout">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="header__link" onClick={handleLinkClick}>Login</Link>
            <Link to="/register" className="header__link" onClick={handleLinkClick}>Registrarse</Link>
          </>
        )}
      </nav>
    </header>
);
}
