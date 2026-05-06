import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

import styles from './DashboardTurnosPage.module.css';

function DashboardTurnosPage() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // useEffect se ejecuta cuando el componente se monta por primera vez
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const response = await apiClient.get(`/turnos/fecha/${formattedDate}`);
        setTurnos(response.data); // Guardamos los turnos en el estado
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
      } finally {
        setLoading(false); // Dejamos de mostrar el mensaje de carga
      }
    };

    fetchTurnos();
  }, []); // El array vacío asegura que solo se ejecute una vez
  const handleEliminarTurno = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este turno?")) {
      return;
    }
    try {
      await apiClient.delete(`/turnos/${id}`); 
      // Actualiza el estado local para reflejar el cambio en la UI
      setTurnos(turnosActuales => 
        turnosActuales.filter(turno => turno.id !== id)
      );
    } catch (error) {
        console.error("Error al eliminar el turno:", error);
        alert('No se pudo eliminar el turno. Intenta nuevamente.');
      }
  };

  const handleNuevoTurno = () => {
    navigate('/turnos/registrarTurno');
  };
  const handleEditarTurno = (id) => {
    navigate(`/turnos/editar/${id}`);
  };

  if (loading) {
    return <p>Cargando turnos del día...</p>;
  }

  return (
    <div className={styles.turnosContainer}>
      <div className={styles.turnosHeader}>
        <h1>Turnos del Día</h1>
        <button onClick={handleNuevoTurno} className={`${styles.btnTabla} ${styles.btnPrimary}`}>
          Nuevo Turno
        </button>
      </div>
      {turnos.length === 0 ? (
        <div className={styles.turnosTable}> {/* Deberías crear esta clase en tu CSS también */}
          <h5>No tienes turnos programados para hoy.</h5>
        </div>
      ) : (
        <table className={styles.turnosTable}>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Kinesiologo</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>
                  <strong>
                    {new Date(turno.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </strong>
                </td>
                <td>
                  <Link to={`/turnos/ver/${turno.id}`}>
                    {turno.paciente.nombre} {turno.paciente.apellido}
                  </Link>
                </td>
                <td>
                  {turno.kinesiologo.nombre} {turno.kinesiologo.apellido}
                </td>
                <td>
                  <button onClick={() => handleEditarTurno(turno.id)} className={`${styles.btnTabla} ${styles.btnEditar}`}>
                    Editar
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEliminarTurno(turno.id)} className={`${styles.btnTabla} ${styles.btnEliminar}`}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DashboardTurnosPage;