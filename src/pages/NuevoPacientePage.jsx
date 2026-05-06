import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import PacienteForm from "../Components/paciente/PacienteForm";
import styles from "./PacientesPage.module.css";

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
            setError("Error al crear el paciente. Por favor, intente nuevamente.");
            alert('Error al crear el paciente. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
};
    return (
        <div className={styles.pacientesContainer}>
            <h1>Registrar Nuevo Paciente</h1>
            {error && <p className={styles.errorText}>{error}</p>}
            <PacienteForm onSubmitForm={handleCrearPaciente}
                loading={loading} textoBoton="Registrar Paciente" />
        </div>
    );
}

export default NuevoPacientePage;