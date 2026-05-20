import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import PacienteForm from "../Components/paciente/PacienteForm";

function NuevoPacientePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCrearPaciente = async (pacienteData) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.post("/pacientes", pacienteData);
            alert("Paciente creado exitosamente.");
            navigate("/pacientes"); 
        } catch (err) {
            console.error(err);
            setError("Error al crear el paciente. Por favor, verifique los datos o intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-col p-4 overflow-hidden bg-slate-100">
            
            <div className="flex-shrink-0 mb-6 max-w-3xl mx-auto w-full">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-sm font-semibold text-slate-500 hover:text-teal-600 mb-3 flex items-center gap-1 transition-colors"
                >
                    ← Volver a la lista
                </button>
                <h1 className="text-3xl font-bold text-slate-800">Registrar Nuevo Paciente</h1>
                <p className="text-slate-600 mt-1">Ingrese los datos personales para armar el historial clínico.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-1">
                <div className="max-w-3xl mx-auto w-full pb-8">
                    
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <PacienteForm 
                        onSubmitForm={handleCrearPaciente}
                        loading={loading} 
                        textoBoton="Registrar Paciente" 
                    />
                </div>
            </div>
            
        </div>
    );
}

export default NuevoPacientePage;