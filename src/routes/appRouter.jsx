import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import MainLayout from '../Components/layout/MainLayout';
import DashboardTurnosPage from '../pages/DashboardTurnosPage';
import CrearNuevoTurno from '../pages/CrearTurnoPage';
import PacientesPage from '../pages/PacientesPage';
import NuevoPacientePage from '../pages/NuevoPacientePage';
import EditarPacientePage from '../pages/EditarPacientePage';
import PacienteDetailPage from '../pages/PacienteDetailPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboardTurnos" element={<DashboardTurnosPage />} />
          <Route path="/turnos/registrarTurno" element={<CrearNuevoTurno />} />

          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/nuevo" element={<NuevoPacientePage />} />
          <Route path="/paciente/detalles/:id" element={<PacienteDetailPage />} />
          <Route path="/pacientes/editar/:id" element={<EditarPacientePage />} />

        </Route>

        {/* Ruta por defecto: si entran a la raíz, manda al login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;