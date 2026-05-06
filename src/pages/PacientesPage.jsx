import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import styles from './PacientesPage.module.css';

function PacientesPage() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const fetchPacientes = async () => {
            try{
                const response = await apiClient.get('/pacientes');
                setPacientes(response.data);
            } catch (err) {
                setError('No se pudeiron cargar los pacientes. Intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchPacientes();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este paciente?')) {
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

    if (loading) return <p>Cargando pacientes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.pacientesContainer}>
            <h1>Lista de Pacientes</h1>
            <Link to="/pacientes/nuevo" className={styles.btnPrimary}>
                Nuevo Paciente
            </Link>

            <input type="text" placeholder="Buscar paciente..." className={styles.buscadorInput} value={filtro}
                onChange={(e) => setFiltro(e.target.value)} />

            <table className={styles.pacientesTable}>
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Nombre y Apellido</th>
                        <th>Celular</th>
                        <th>Obra Social</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {pacientesFiltrados.map((paciente) => (
                        <tr key={paciente.id}>
                            <td>{paciente.dni}</td>
                            <td>
                                <Link to={`/paciente/detalles/${paciente.id}`}>
                                    {paciente.nombre} {paciente.apellido}
                                </Link>
                            </td>
                            <td>{paciente.celular}</td>
                            <td>{paciente.obraSocial || 'N/A'}</td>
                            <td>
                                <button onClick={() => handleEliminar(paciente.id)} className={`${styles.btnTabla} ${styles.btnEliminar}`}>
                                    Eliminar 
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PacientesPage;
