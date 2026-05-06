import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

// Recibimos una prop 'user' que contendrá la info decodificada del token (incluyendo si es admin)
function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>KinesioApp</div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/dashboardTurnos" className={({ isActive }) => isActive ? styles.active : ''}>
            Turnos del Día
          </NavLink>
        </li>
        <li>
          <NavLink to="/pacientes" className={({ isActive }) => isActive ? styles.active : ''}>
            Pacientes
          </NavLink>
        </li>
        {/* Renderizado Condicional: Solo muestra este link si el usuario es admin */}
        {user && user.isAdmin && (
          <li>
            <NavLink to="/turnos/new" className={({ isActive }) => isActive ? styles.active : ''}>
              Crear Turno
            </NavLink>
          </li>
        )}
      </ul>
      <div className={styles.navUser}>
        <span>Hola, {user?.nombre || 'Usuario'}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;