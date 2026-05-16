import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// Podés borrar la importación de Sidebar.module.css

function Sidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Función auxiliar para mantener limpio el className de los NavLinks
  // Si está activo, lo pinta de azul. Si no, lo deja gris y aplica hover.
  const baseLinkClass = "flex items-center gap-2 px-4 py-1 rounded-xl font-medium transition-colors duration-200";
  const getLinkClasses = ({ isActive }) => 
    isActive 
      ? `${baseLinkClass} bg-slate-100 text-teal-600 shadow-sm border border-teal-300` 
      : `${baseLinkClass} text-slate-700 hover:bg-slate-50 hover:text-slate-900`;

  return (
    // flex-shrink-0 asegura que el sidebar no se comprima si la pantalla es chica
    <div className="w-50 h-full bg-teal-500 border-r border-slate-200 flex flex-col flex-shrink-0 shadow-[4px_0_20px_rgba(0,0,0,0.02)] z-10">
      
      {/* Cabecera del Sidebar (Logo y Perfil) */}
      <div className="p-6 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-2xl font-extrabold text-center text-blue-800 tracking-tight">CKAT</h2>
        
        <div className="mt-6 flex items-center gap-3">
          {/* Avatar con la inicial del correo o nombre */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg">
            {user?.mail ? user.mail.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-800 truncate">
              {user?.nombre}
            </span>
            <span className="text-xs font-medium text-black truncate">
              {user?.esAdmin ? 'Administrador' : 'Kinesiólogo'}
            </span>
          </div>
        </div>
      </div>

      {/* Navegación (scroll interno) */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        <NavLink to="/dashboardTurnos" className={getLinkClasses}>
          <span className="text-xl">📅</span>
          Turnos del Día
        </NavLink>
        
        <NavLink to="/pacientes" className={getLinkClasses}>
          <span className="text-xl">👥</span>
          Pacientes
        </NavLink>

        {/* Sección condicional: Solo para Administradores */}
        {user?.esAdmin && (
          <div className="pt-2">
            <p className="px-4 mb-2 text-xs font-bold text-black uppercase tracking-wider">
              Administración
            </p>
            <div className="space-y-2">
              <NavLink to="/pacientes/nuevo" className={getLinkClasses}>
                <span className="text-xl">➕</span>
                Nuevo Paciente
              </NavLink>
              
              <NavLink to="/turnos/registrarTurno" className={getLinkClasses}>
                <span className="text-xl">🗓️</span>
                Agendar Turno
              </NavLink>

              <NavLink to="/historial" className={getLinkClasses}>
                <span className="text-xl">🗓️</span>
                Historial Pacientes
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Footer (Cerrar Sesión) */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <span className="text-lg">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;