import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import TurnoForm from "../Components/turnos/CrearTurnosForm";
import styles from "./CrearTurnoPage.module.css";

function CrearTurnoPage() {
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState([]);
    const [kinesiologos, setKinesiologos] = useState([]);
    const [feriados, setFeriados] = useState([]);
    const [warningDia, setWarningDia] = useState('');
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingForm, setLoadingForm] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const anioActual = new Date().getFullYear();
                
                const [resPacientes, resKinesiologos, resFeriados] = await Promise.all([
                    apiClient.get("/pacientes"),
                    apiClient.get("/kinesiologos"),
                    apiClient.get(`/feriados/${anioActual}`)
                ]);
                setPacientes(resPacientes.data);
                setKinesiologos(resKinesiologos.data);
                setFeriados(resFeriados.data.map(f => f.fecha));
            } catch (err) {
                console.error("Error al cargar datos para el formulario:", err);
                setError("No se pudieron cargar los datos. Intenta nuevamente.", err);
            } finally {
                setLoadingPage(false);
            }
        };
        fetchData();
    }, []);

    const chequearDiaNoLaborable = (fecha) => {
        const diaSemana = fecha.getDay();

        const fechaStr = fecha.toISOString().split('T')[0];
        if (diaSemana === 0 || diaSemana === 6) {
            setWarningDia('¡Atención! Ha seleccionado un Sabado o Domingo.');
        } else if (feriados.includes(fechaStr)) {
            setWarningDia('¡Atención! Ha seleccionado un día feriado.');
        } else {
            setWarningDia('');
        }        
    };

    const handleRegistrarTurno = async (turnoData) => {
        setLoadingForm(true);
        try {
            await apiClient.post("/turnos", turnoData);
            alert('¡Turno registrado con exito!');
            navigate("/dashboardTurnos");
        } catch (err) {
            console.error("Error al registrar el turno:", err);
            alert('No se pudo registrar el turno. Intenta nuevamente.');
            setLoadingForm(false);
        }
    };

    if (loadingPage) {
        return <p>Cargando formulario...</p>;
    }
    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.turnosContainer}>
                <h1>Registrar Nuevo Turno</h1>
            <div className={styles.alertaWarning}>
                {warningDia}
            </div>
              <TurnoForm onSubmitTurno={handleRegistrarTurno} pacientes={pacientes} kinesiologos={kinesiologos} 
                loading={loadingForm} onFechaChange={chequearDiaNoLaborable} />
        </div>
        );
    }

export default CrearTurnoPage;