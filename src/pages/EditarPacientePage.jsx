import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import PacienteForm from '../Components/paciente/PacienteForm';
import styles from './PacientesPage.module.css';

function EditarPacientePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        setLoading(true);
        setError(null);
        try {
            await apiClient.put(`/pacientes/${id}`, pacienteData);
            alert('Paciente actualizado exitosamente.');
            navigate('/pacientes');
        } catch (err) {
            setError('Error al actualizar el paciente. Por favor, intente nuevamente.');
            alert('Error al actualizar el paciente. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !paciente) return <p>Cargando datos del paciente...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!paciente) return <p>Paciente no encontrado.</p>;

    return (
        <div className={styles.pacientesContainer}>
            <h1>Editar Paciente</h1>
            <PacienteForm onSubmitForm={handleActualizarPaciente} loading={loading} textoBoton={"Guardar Cambios"}
                pacienteInicial={paciente} />
        </div>
    );
}

export default EditarPacientePage;