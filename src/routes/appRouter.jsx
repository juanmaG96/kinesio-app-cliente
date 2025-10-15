import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardTurnosPage from '../pages/DashboardTurnosPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboardTurnos" element={<DashboardTurnosPage />} />

        {/* Ruta por defecto: si entran a la raíz, los mandas al login */}
        <Route path="/" element={<LoginPage />} />

        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;