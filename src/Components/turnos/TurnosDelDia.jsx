import React from 'react';

function TurnosDelDia({ turnos, onEditar, onEliminar, onVerDetalle, isAdmin }) {
    if (turnos.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-lg font-medium">No hay turnos para esta fecha</p>
                <p className="text-sm">El consultorio parece estar libre.</p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-1 py-4 font-semibold">Hora</th>
                        <th className="px-1 py-4 font-semibold">Paciente</th>
                        <th className="px-1 py-4 font-semibold">Kinesiólogo</th>
                        <th className="px-1 py-4 font-semibold">Estado</th>
                        <th className="px-3 py-4 font-semibold text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {turnos.map((turno) => (
                        <tr key={turno.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-1 py-4">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                    {new Date(turno.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </td>
                            <td className="px-1 py-4">
                                <button onClick={() => onVerDetalle(turno.id)}
                                    className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                                    >
                                    {turno.paciente.nombre} {turno.paciente.apellido}
                                </button>
                            </td>
                            <td className="px-1 py-4 text-slate-500">
                                {turno.kinesiologo.nombre} {turno.kinesiologo.apellido}
                            </td>
                            <td className="px-1 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    turno.estado === 'ASIGNADO' ? 'bg-green-100 text-green-700' :
                                    turno.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                    turno.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' : ''
                                }`}>
                                    {turno.estado}
                                </span>
                            </td>
                            <td className="px-3 py-4 text-right space-x-4">
                                {isAdmin && (
                                    <>
                                        <button onClick={() => onEditar(turno.id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Editar
                                        </button>
                                        <button onClick={() => onEliminar(turno.id)}
                                            className="text-red-500 hover:text-red-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TurnosDelDia;