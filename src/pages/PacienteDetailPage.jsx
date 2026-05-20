import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { jwtDecode } from 'jwt-decode';

function PacienteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState(null);
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setIsAdmin(decoded.esAdmin === true);
                } catch (error) {
                    console.error("Error al decodificar token:", error);
                }
            }
        }, []);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando expediente del paciente...</p>
            </div>
        );
    }
    
    if (error) return <p className="p-6 text-red-600 font-medium">{error}</p>;
    if (!paciente) return <p className="p-6 text-slate-600">Paciente no encontrado.</p>;

    return (
        <div className="h-full w-full flex flex-col p-4 lg:p-6 overflow-hidden bg-slate-50">
            
            {/* Header Fijo */}
            <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-sm font-semibold text-slate-500 hover:text-teal-600 mb-2 flex items-center gap-1 transition-colors"
                    >
                        ← Volver a la lista
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">
                        {paciente.nombre} {paciente.apellido}
                    </h1>
                </div>

                {isAdmin && (
                <button 
                    onClick={() => navigate(`/pacientes/editar/${paciente.id}`)}
                    className="bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50 px-5 py-2 rounded-xl font-bold transition-all shadow-sm"
                >
                    Editar Datos
                </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-8">
                
                {/* Información Personal */}
                <div className="bg-white p-6 rounded-2xl shadow-md shadow-teal-200 border border-teal-200 flex flex-col sm:flex-row gap-8">
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Documento (DNI)</p>
                        <p className="text-lg font-bold text-slate-800">{paciente.dni}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Teléfono Celular</p>
                        <p className="text-lg font-bold text-slate-800">{paciente.celular || 'No registrado'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Obra Social</p>
                        <span className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                            {paciente.obraSocial || 'Particular'}
                        </span>
                    </div>
                </div>

                {/* Historial de Turnos */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>📅</span> Historial de Turnos
                    </h2>
                    
                    {turnos.length === 0 ? (
                        <div className="bg-white p-6 rounded-2xl shadow-md shadow-teal-200 border border-teal-200 text-center">
                            <p className="text-slate-500 font-medium">Este paciente no tiene turnos registrados aún.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-md shadow-teal-200 border border-teal-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-teal-50/50 border-b border-teal-200 text-teal-800">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Fecha</th>
                                            <th className="px-6 py-4 font-semibold">Horario</th>
                                            <th className="px-6 py-4 font-semibold">Profesional</th>
                                            <th className="px-6 py-4 font-semibold">Estado</th>
                                            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-teal-100/50">
                                        {turnos.map(turno => (
                                            <tr key={turno.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-700">
                                                    {new Date(turno.fecha).toLocaleDateString('es-AR')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(turno.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(turno.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {turno.kinesiologo.nombre} {turno.kinesiologo.apellido}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                                        turno.estado === 'ASIGNADO' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                        turno.estado === 'CANCELADO' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                        'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}>
                                                        {turno.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    
                                                    {isAdmin && turno.estado === 'ASIGNADO' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handleEditarTurno(turno.id)} 
                                                                className="text-teal-600 hover:text-teal-800 font-semibold transition-colors"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button 
                                                                onClick={() => handleCancelarTurno(turno.id)}
                                                                className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-xs">Sin acciones</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ficha Kinésica */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>📝</span> Ficha Kinésica
                    </h2>
                    <div className="bg-white p-6 rounded-2xl shadow-md shadow-teal-200 border border-teal-200 min-h-[200px]">
                        <p className="text-slate-500 italic mb-4">Aquí irá el historial de atención del paciente...</p>
                        
                        <form className="mt-4 border-t border-slate-100 pt-4">
                            <label className="block text-sm font-medium text-slate-600 mb-2">Nueva Nota Evolutiva</label>
                            <textarea 
                                className="w-full px-4 py-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm shadow-teal-100 resize-none"
                                rows="3"
                                placeholder="Escriba los detalles de la sesión aquí..."
                            ></textarea>
                            <div className="mt-3 flex justify-end">
                                <button type="button" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md shadow-teal-200">
                                    Guardar Nota
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PacienteDetailPage;