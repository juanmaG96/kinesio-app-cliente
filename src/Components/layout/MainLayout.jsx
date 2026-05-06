import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Importa Outlet
import Sidebar from './Sidebar'; // Importa tu componente Sidebar
import styles from './MainLayout.module.css';

// Aquí podrías decodificar el token para obtener los datos del usuario
// Por ahora, lo simulamos. Más adelante lo haremos real.
const mockUser = {
  nombre: "Admin",
  isAdmin: true
};

function MainLayout() {
  return (
    <div className={styles.layout}>
      {/* El Sidebar siempre estará visible en este layout */}
      <Sidebar user={mockUser} />
      
      {/* El <Outlet> es un marcador de posición.
          React Router renderizará aquí el componente de la página actual 
          (DashboardPage, PatientsPage, etc.) */}
      <main className={styles.content}>
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;