import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

function DashboardTurnosPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta cuando el componente se monta por primera vez
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        // Hacemos la petición GET a la ruta de turnos de tu API
        const response = await apiClient.get('/turnos/today');
        setTurnos(response.data); // Guardamos los turnos en el estado
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
        // Aquí podrías manejar errores (ej: si el token expiró)
      } finally {
        setLoading(false); // Dejamos de mostrar el mensaje de carga
      }
    };

    fetchTurnos();
  }, []); // El array vacío asegura que solo se ejecute una vez

  if (loading) {
    return <p>Cargando turnos del día...</p>;
  }

  return (
    <div>
      <h1>Turnos del Día</h1>
      {turnos.length > 0 ? (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              <strong>{new Date(turno.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> - {turno.paciente.nombre} {turno.paciente.apellido}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes turnos programados para hoy.</p>
      )}
    </div>
  );
}

export default DashboardTurnosPage;