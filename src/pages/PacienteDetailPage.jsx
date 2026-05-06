import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import styles from "./DashboardTurnosPage.module.css";
import pageStyles from "./CrearTurnoPage.module.css";

function PacienteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState(null);
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPacienteData = async () => {
            try {
                setLoading(true);
                const [resPaciente, resTurnos] = await Promise.all([
                    apiClient.get(`/pacientes/${id}`),
                    apiClient.get(`/turnos/paciente/${id}`)
                ]);
                setPaciente(resPaciente.data);
                setTurnos(resTurnos.data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar los datos del paciente: ", err);
                setError("No se pudieron cargar los datos del paciente.");
            } finally {
                setLoading(false);
            }
        };

        fetchPacienteData();
    }, [id]);

    const handleCancelarTurno = async (turnoId) => {
        if (!window.confirm("¿Está seguro de que desea cancelar este turno?")) return;
        try {
            const res = await apiClient.patch(`/turnos/cancelar/${turnoId}`);
            const turnoActualizado = res.data;

            setTurnos(turnosActuales => 
                turnosActuales.filter(turno =>
                    turno.id === turnoId ? turnoActualizado : turno
                )
            );
            alert("Turno cancelado exitosamente.");
        } catch (err) {
            console.error("Error al cancelar el turno: ", err);
            alert("No se pudo cancelar el turno. Por favor, intente nuevamente.");
        }
    };

    const handleEditarTurno = (turnoId) => {
        navigate(`/turnos/editar/${turnoId}`);
    };

    if (loading) return <p>Cargando datos del paciente...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!paciente) return <p>Paciente no encontrado.</p>;

    return (
        <div className={styles.turnosContainer}>
            <div className={styles.turnosHeader}>
                <h1>Detalle del Paciente: {paciente.nombre} {paciente.apellido}</h1>
                <button to={`/turnos/editar/${paciente.id}`} className={styles.btnPrimary}>
                    Editar Datos del Paciente
                </button>
            </div>

            <div className={styles.infoCard}>
                <p><strong>DNI: </strong> {paciente.dni}</p>
                <p><strong>Teléfono: </strong> {paciente.celular}</p>
            </div>

            <hr className={styles.divider}/>
            <h2>Historial de Turnos</h2>
            {turnos.length === 0 ? (
                <p className={styles.alertInfo}>Este paciente no tiene turnos registrados</p>
            ) : (
                <table className={styles.turnosTable}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Profesional</th>
                            <th>Estado</th>
                            {/* <th></th> */}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map(turno => (
                            <tr key={turno.id}>
                                <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                                <td>{new Date(turno.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{new Date(turno.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{turno.profesionalNombre} {turno.profesionalApellido}</td>
                                <td>{turno.estado}</td>
                                <td>
                                {turno.estado === 'ASIGNADO' && (
                                        <>
                                            <button onClick={() => handleEditarTurno(turno.id)} 
                                                className={`${styles.btnTabla} ${styles.btnEditar}`}>
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleCancelarTurno(turno.id)}
                                                className={`${styles.btnTabla} ${styles.btnEliminar}`}>
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                    {turno.estado !== 'ASIGNADO' && (
                                        <span>-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <hr className={styles.divider} />
            <h2>Ficha Kinésica</h2>
            <p>Aqui ira el historiakl de atencion del paciente...</p>
            <form>
                ... (formulario para agregar nueva nota) ...
            </form>
        </div>
    );

}

export default PacienteDetailPage;