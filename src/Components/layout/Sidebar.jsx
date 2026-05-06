import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>KinesioApp</h3>
        <span>Bienvenido, {user?.nombre}</span>
      </div>
      <nav className={styles.sidebarNav}>
        <ul>
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
          {/* Renderizado Condicional: Muestra solo si es admin */}
          {user && user.isAdmin && (
            <li>
              <NavLink to="/pacientes" className={({ isActive }) => isActive ? styles.active : ''}>
                Nuevo Paciente
              </NavLink>
            </li>
          )}
          {user && user.isAdmin && (
            <li>
              <NavLink to="/turnos" className={({ isActive }) => isActive ? styles.active : ''}>
                Agendar Turno
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Sidebar;