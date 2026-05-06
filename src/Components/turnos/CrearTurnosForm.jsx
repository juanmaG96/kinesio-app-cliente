import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./CrearTurnosForm.module.css";

function CrearTurnosForm({ onSubmitTurno, pacientes, kinesiologos, loading, onFechaChange}) {
    const [fecha, setFecha] = useState(new Date());
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [pacienteId, setPacienteId] = useState('');
    const [kinesiologoId, setKinesiologoId] = useState('');
    
    const handleCalendarChange = (nuevaFecha) => {
        setFecha(nuevaFecha);
        onFechaChange(nuevaFecha);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        try {
            if (!horaInicio || !horaFin || horaInicio >= horaFin) {
                alert('Por favor, selecciona una hora de inicio y hora de fin correcta.');
                return;
            }
            const [inicioHoras, inicioMinutos] = horaInicio.split(':');
            const fechaHoraInicio = new Date(fecha);
            fechaHoraInicio.setHours(inicioHoras, inicioMinutos, 0, 0);

            const [finHoras, finMinutos] = horaFin.split(':');
            const fechaHoraFin = new Date(fecha);
            fechaHoraFin.setHours(finHoras, finMinutos, 0, 0);

            onSubmitTurno({
                pacienteId: parseInt(pacienteId),
                kinesiologoId: parseInt(kinesiologoId),
                fecha: fecha.toISOString().split('T')[0],
                horaInicio: fechaHoraInicio.toISOString(),
                horaFin: fechaHoraFin.toISOString()
            });
        } catch (error) {
            console.error("Error al preparar datos del turno:", error);
            alert("Ocurrió un error al preparar los datos del turno. Intenta nuevamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formColumn}>
                <h3>Selecciona Fecha y Hora</h3>
                <div className={styles.calendarWrapper}>
                    <Calendar onChange={handleCalendarChange} value={fecha} minDate={new Date()} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="horaInicio">Hora de Inicio:</label>
                    <input type="time" id="horaInicio" className={styles.formInput} value={horaInicio} 
                        onChange={(e) => setHoraInicio(e.target.value)} required/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="horaFin">Hora de Fin:</label>
                    <input type="time" id="horaFin" className={styles.formInput} value={horaFin} 
                        onChange={(e) => setHoraFin(e.target.value)} required/>
                </div>
            </div>
            <div className={styles.formColumn}>
                <h3>Asigna el turno</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="paciente">Paciente:</label>
                    <select id="paciente" className={styles.formInput} value={pacienteId}
                        onChange={(e) => setPacienteId(e.target.value)} required>
                            <option value="" disabled>Selecciona un paciente...</option>
                            {pacientes.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.nombre} {paciente.apellido} - DNI: {paciente.dni}
                                </option>
                            ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="kinesiologo">Kinesiólogo:</label>
                    <select id="kinesiologo" className={styles.formInput} value={kinesiologoId}
                        onChange={(e) => setKinesiologoId(e.target.value)} required>
                            <option value="" disabled>Selecciona un kinesiólogo...</option>
                            {kinesiologos.map((kinesiologo) => (
                                <option key={kinesiologo.id} value={kinesiologo.id}>
                                    {kinesiologo.nombre} {kinesiologo.apellido} - DNI: {kinesiologo.dni}
                                </option>
                            ))}
                    </select>
                </div>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Turno'}
                </button>
            </div>
        </form>
    );
}

export default CrearTurnosForm;