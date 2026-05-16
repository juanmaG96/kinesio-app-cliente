import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import TurnoForm from "../Components/turnos/CrearTurnosForm";

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
                console.error("Error al cargar datos:", err);
                setError("No se pudieron cargar los datos de pacientes y profesionales.");
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
            setWarningDia('¡Atención! Ha seleccionado un Sábado o Domingo.');
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
            alert('¡Turno registrado con éxito!');
            navigate("/dashboardTurnos");
        } catch (err) {
            console.error("Error al registrar:", err);
            alert('No se pudo registrar el turno. Verifique los datos.');
            setLoadingForm(false);
        }
    };

    if (loadingPage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando formulario...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
                <h3 className="font-bold mb-2">Error de Conexión</h3>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full max-w-5xl mx-auto bg-slate-100 flex flex-col p-6 overflow-hidden">
            {/* Cabecera */}
            <div className="mb-1">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 mb-2 flex items-center gap-1 transition-colors"
                >
                    ← Volver al panel
                </button>
                <h1 className="text-3xl font-bold text-slate-800">Registrar Nuevo Turno</h1>
                <p className="text-slate-600 mt-1">Asigne un horario, paciente y profesional responsable.</p>
            </div>

            {/* Alerta de Feriado/Fin de Semana (Renderizado Condicional) */}
            {warningDia && (
                <div className="mb-1 bg-amber-100 border-l-4 border-amber-500 p-2 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {/* Icono de advertencia simple usando un caracter Unicode */}
                            <span className="text-amber-500 text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">
                                {warningDia}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario */}
            <TurnoForm 
                onSubmitTurno={handleRegistrarTurno} 
                pacientes={pacientes} 
                kinesiologos={kinesiologos} 
                loading={loadingForm} 
                onFechaChange={chequearDiaNoLaborable} 
            />
        </div>
    );
}

export default CrearTurnoPage;