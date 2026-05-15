import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { jwtDecode } from 'jwt-decode';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import apiClient from '../api/axiosConfig';
import TurnosDelDia from '../Components/turnos/TurnosDelDia';


function DashboardTurnosPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("CONTENIDO DEL TOKEN:", decodedToken); // Agrega este console.log para verificar el contenido del token decodificado
        setIsAdmin(decodedToken.esAdmin === true);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  // Función para obtener turnos (la sacamos del useEffect para poder re-usarla al cambiar de fecha)
  const fetchTurnos = async (date) => {
    setLoading(true); // Mostramos el mensaje de carga mientras obtenemos los datos
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const response = await apiClient.get(`/turnos/fecha/${formattedDate}`);
      setTurnos(response.data); // Guardamos los turnos en el estado
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
    } finally {
      setLoading(false); // Dejamos de mostrar el mensaje de carga
    }
  };

    useEffect(() => {
      fetchTurnos(selectedDate);
    }, [selectedDate]); // Volver a obtener los turnos cada vez que cambie la fecha seleccionada

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este turno?")) return;
    try {
      await apiClient.delete(`/turnos/${id}`); 
      // Actualiza el estado local para reflejar el cambio en la UI
      setTurnos(prev => prev.filter(turno => turno.id !== id));
    } catch (error) {
        alert('No se pudo eliminar el turno. Intenta nuevamente.');
      }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-slate-50/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Turnos</h1>
          <p className="text-slate-500">Visualiza y organiza la agenda kinesica.</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
          <button onClick={() => navigate('/turnos/registrarTurno')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md shadow-blue-200 transition-all active:scale-95"
          >
            + Nuevo Turno
          </button>
          )}
        </div>
          
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendarios */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate}
              className="w-full border-none shadow-none font-sans"
            />
          </div>
        </div>

        {/* Turnos del día seleccionado */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-700">
                Turnos del {selectedDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
              </h2>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                {turnos.length} turnos
              </span>
            </div>
            
            <div className="p-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 text-sm font-medium">Sincronizando agenda...</p>
                </div>
              ) : (
                <TurnosDelDia 
                  turnos={turnos}
                  onEditar={(id) => navigate(`/turnos/editar/${id}`)}
                  onEliminar={handleEliminar}
                  onVerDetalle={(id) => navigate(`/turnos/ver/${id}`)}
                  isAdmin={isAdmin}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTurnosPage;