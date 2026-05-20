import React, { useState, useEffect } from 'react';

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
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        onSubmitForm({ dni, nombre, apellido, celular, obraSocial });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-md shadow-teal-200 border border-teal-200">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">
                Datos Personales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-slate-600 mb-1">Nombre *</label>
                    <input 
                        type="text" id="nombre" value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm shadow-teal-200" 
                    />
                </div>
                
                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-slate-600 mb-1">Apellido *</label>
                    <input 
                        type="text" id="apellido" value={apellido} 
                        onChange={(e) => setApellido(e.target.value)} required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm shadow-teal-200" 
                    />
                </div>
                
                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-slate-600 mb-1">DNI *</label>
                    <input 
                        type="text" id="dni" value={dni} 
                        onChange={(e) => setDni(e.target.value)} required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm shadow-teal-200" 
                    />
                </div>
                
                <div>
                    <label htmlFor="celular" className="block text-sm font-medium text-slate-600 mb-1">Celular *</label>
                    <input 
                        type="text" id="celular" value={celular} 
                        onChange={(e) => setCelular(e.target.value)} required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm shadow-teal-200" 
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label htmlFor="obraSocial" className="block text-sm font-medium text-slate-600 mb-1">Obra Social (Opcional)</label>
                    <input 
                        type="text" id="obraSocial" value={obraSocial} 
                        onChange={(e) => setObraSocial(e.target.value)}
                        placeholder="Ej: PAMI, OSDE, Iosper..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm shadow-teal-200" 
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`py-2 px-8 rounded-xl font-bold text-white shadow-md transition-all shadow-sm shadow-teal-200 ${
                        loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'
                    }`}
                >
                    {loading ? 'Procesando...' : textoBoton}
                </button>
            </div>
        </form>
    );
}

export default PacienteForm;