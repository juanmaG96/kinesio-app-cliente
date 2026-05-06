import React, { useState, useEffect } from 'react';
import styles from './PacienteForm.module.css';

function PacienteForm({ onSubmitForm, pacienteInicial, loading, textoBoton }) {

    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [celular, setCelular] = useState('');
    const [obraSocial, setObraSocial] = useState('');

    useEffect(() => {
        if (pacienteInicial) {
            setDni(pacienteInicial.dni || '');
            setNombre(pacienteInicial.nombre || '');
            setApellido(pacienteInicial.apellido || '');
            setCelular(pacienteInicial.celular || '');
            setObraSocial(pacienteInicial.obraSocial || '');
        }
    }, [pacienteInicial]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!dni || !nombre || !apellido || !celular) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        onSubmitForm({
            dni, nombre, apellido, celular, obraSocial
        });
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="dni">DNI:</label>
                <input type="text" id="dni" value={dni} className={styles.formInput}
                    onChange={(e) => setDni(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" value={nombre} className={styles.formInput}
                    onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="apellido">Apellido:</label>
                <input type="text" id="apellido" value={apellido} className={styles.formInput}
                    onChange={(e) => setApellido(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="celular">Celular:</label>
                <input type="text" id="celular" value={celular} className={styles.formInput}
                    onChange={(e) => setCelular(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="obraSocial">Obra Social:</label>
                <input type="text" id="obraSocial" value={obraSocial} className={styles.formInput}
                    onChange={(e) => setObraSocial(e.target.value)} />
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Cargando...' : textoBoton}
            </button>
        </form>
    );
}

export default PacienteForm;