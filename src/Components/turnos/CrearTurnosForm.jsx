import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


function CrearTurnosForm({ onSubmitTurno, pacientes, kinesiologos, loading, onFechaChange }) {
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
            alert("Ocurrió un error al preparar los datos del turno.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl shadow-md shadow-teal-200 border border-slate-400">
            {/* Fecha y Hora */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">1. Fecha y Horario</h3>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-400 flex justify-center">
                    <Calendar 
                        onChange={handleCalendarChange} 
                        value={fecha} 
                        minDate={new Date()} 
                        className="border-none bg-transparent font-sans"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="horaInicio">
                            Hora Inicio
                        </label>
                        <input 
                            type="time" 
                            id="horaInicio" 
                            value={horaInicio} 
                            onChange={(e) => setHoraInicio(e.target.value)} 
                            required
                            className="w-full px-4 py-2 border border-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="horaFin">
                            Hora Fin
                        </label>
                        <input 
                            type="time" 
                            id="horaFin" 
                            value={horaFin} 
                            onChange={(e) => setHoraFin(e.target.value)} 
                            required
                            className="w-full px-4 py-2 border border-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Asignación */}
            <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2">2. Asignación</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="paciente">
                            Paciente
                        </label>
                        <select 
                            id="paciente" 
                            value={pacienteId}
                            onChange={(e) => setPacienteId(e.target.value)} 
                            required
                            className="w-full px-4 py-2 border border-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                        >
                            <option value="" disabled>Seleccionar paciente...</option>
                            {pacientes.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.apellido}, {paciente.nombre} (DNI: {paciente.dni})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="kinesiologo">
                            Kinesiólogo Responsable
                        </label>
                        <select 
                            id="kinesiologo" 
                            value={kinesiologoId}
                            onChange={(e) => setKinesiologoId(e.target.value)} 
                            required
                            className="w-full px-4 py-2 border border-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                        >
                            <option value="" disabled>Seleccionar profesional...</option>
                            {kinesiologos.map((kinesiologo) => (
                                <option key={kinesiologo.id} value={kinesiologo.id}>
                                    {kinesiologo.apellido}, {kinesiologo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-6 flex justify-center">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`py-3 px-12 rounded-xl font-bold text-white shadow-md shadow-teal-200 transition-all ${
                            loading 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'
                        }`}
                    >
                        {loading ? 'Procesando registro...' : 'Confirmar y Registrar Turno'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CrearTurnosForm;