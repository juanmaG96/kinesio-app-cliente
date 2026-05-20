import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import PacienteForm from '../Components/paciente/PacienteForm';

function EditarPacientePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await apiClient.get(`/pacientes/${id}`);
                setPaciente(response.data);
            } catch (err) {
                setError('Error al cargar los datos del paciente. Intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchPaciente();
    }, [id]);

    const handleActualizarPaciente = async (pacienteData) => {
        setSaving(true);
        setError(null);
        try {
            await apiClient.put(`/pacientes/${id}`, pacienteData);
            alert('Paciente actualizado exitosamente.');
            navigate(-1); // Mejor UX: Vuelve exactamente a la ficha del paciente de donde vino
        } catch (err) {
            setError('Error al actualizar el paciente. Por favor, intente nuevamente.');
            alert('Error al actualizar el paciente. Por favor, intente nuevamente.');
        } finally {
            setSaving(false);
        }
    };

    // Pantalla de carga inicial
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando datos del paciente...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col p-4 overflow-hidden bg-slate-50">
            
            <div className="flex-shrink-0 mb-6 max-w-3xl mx-auto w-full">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-sm font-semibold text-slate-500 hover:text-teal-600 mb-3 flex items-center gap-1 transition-colors"
                >
                    ← Volver a la ficha
                </button>
                <h1 className="text-3xl font-bold text-slate-800">Editar Paciente</h1>
                <p className="text-slate-500 mt-1">Actualice los datos personales y de contacto.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-1">
                <div className="max-w-3xl mx-auto w-full pb-8">
                    
                    {/* Alerta de error */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {!paciente && !error ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                            <p className="text-slate-500 font-medium">Paciente no encontrado.</p>
                        </div>
                    ) : (
                        paciente && (
                            <PacienteForm 
                                onSubmitForm={handleActualizarPaciente} 
                                loading={saving} 
                                textoBoton="Guardar Cambios"
                                pacienteInicial={paciente} 
                            />
                        )
                    )}
                </div>
            </div>
            
        </div>
    );
}

export default EditarPacientePage;