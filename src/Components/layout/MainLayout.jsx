import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importamos el decodificador
import Sidebar from './Sidebar';

function MainLayout() {
  const [user, setUser] = useState(null);

  // Cargamos el usuario real desde el token apenas monta el layout
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error al decodificar token en Layout:", error);
      }
    }
  }, []);

  return (
    // CONTENEDOR PRINCIPAL: h-screen y overflow-hidden bloquean el scroll de la página entera
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
      
      {/* Pasamos el usuario real al Sidebar */}
      <Sidebar user={user} />
      
      <main className="flex-1 h-full bg-slate-100 overflow-hidden relative">
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;