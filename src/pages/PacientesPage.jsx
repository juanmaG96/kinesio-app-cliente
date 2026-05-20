import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

function PacientesPage() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('');
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
        const fetchPacientes = async () => {
            try {
                const response = await apiClient.get('/pacientes');
                setPacientes(response.data);
            } catch (err) {
                setError('No se pudieron cargar los pacientes. Intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchPacientes();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar permanentemente este paciente?')) {
            return;
        }
        try {
            await apiClient.delete(`/pacientes/${id}`);
            setPacientes(pacientes.filter(paciente => paciente.id !== id));
            alert('Paciente eliminado exitosamente.');
        } catch (err) {
            alert('Error al eliminar el paciente. Por favor, intente nuevamente.');
        }
    };

    const pacientesFiltrados = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        p.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
        p.dni.includes(filtro)
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando directorio de pacientes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 h-full bg-slate-50">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col p-4 lg:p-6 overflow-hidden bg-slate-50">
            
            {/* Cabecera */}
            <div className="flex-shrink-0 mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Directorio de Pacientes</h1>
                <p className="text-slate-500 mt-1">Gestione las fichas y datos de contacto.</p>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="w-full sm:w-96 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        🔍
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre, apellido o DNI..." 
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
                    />
                </div>

                {isAdmin && (
                    <button 
                        onClick={() => navigate('/pacientes/nuevo')}
                        className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-bold shadow-md shadow-teal-200 transition-all active:scale-95 whitespace-nowrap"
                    >
                        + Nuevo Paciente
                    </button>
                )}
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-md shadow-teal-200 border border-teal-200 flex flex-col overflow-hidden min-h-0">
                
                {pacientesFiltrados.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
                        <p>No se encontraron pacientes que coincidan con la búsqueda.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-sm text-slate-600 relative">
                            <thead className="bg-teal-50/95 backdrop-blur-sm border-b border-teal-200 text-teal-800 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">DNI</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nombre y Apellido</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Celular</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Obra Social</th>
                                    {isAdmin && (
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-100/50">
                                {pacientesFiltrados.map((paciente) => (
                                    <tr key={paciente.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {paciente.dni}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link 
                                                to={`/paciente/detalles/${paciente.id}`}
                                                className="font-bold text-teal-600 hover:text-teal-800 transition-colors"
                                            >
                                                {paciente.nombre} {paciente.apellido}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {paciente.celular || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {paciente.obraSocial ? (
                                                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold border border-slate-200">
                                                    {paciente.obraSocial}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Particular</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleEliminar(paciente.id)} 
                                                    className="text-red-500 hover:text-red-700 font-semibold opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <div className="flex-shrink-0 mt-3 text-right">
                <p className="text-xs font-medium text-slate-400">
                    Total registrados: {pacientesFiltrados.length}
                </p>
            </div>
            
        </div>
    );
}

export default PacientesPage;