import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../Components/auth/LoginForm';
import RegisterUserForm from '../Components/User/RegisterUserForm';
import apiClient from '../api/axiosConfig'; // Importamos nuestro cliente axios

function LoginPage() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogin = async (credentials) => {
    try {
      const payload = {
        mail: credentials.email,
        contraseña: credentials.password
      };
      // Hacemos la petición POST a la ruta de login de tu API
      const response = await apiClient.post('/auth/login', payload);

      // Si la API responde con éxito, guardamos el token
      const token = response.data.token;
      localStorage.setItem('authToken', token); // Guardamos en el navegador

      // Redirigimos al usuario al dashboard
      navigate('/dashboardTurnos');

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert('Email o contraseña incorrectos.');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const payload = {
        dni: userData.dni,
        nombre: userData.nombre,
        apellido: userData.apellido,
        mail: userData.email,
        contraseña: userData.password
      };
      await apiClient.post('/kinesiologos', payload);
      alert('Registro exitoso! Ahora puedes iniciar sesión.');
      setIsLoginView(true); // Volver a la vista de login
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert('No se pudo completar el registro. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4"> {/* Contenedor principal */}
      <div className="bg-white max-w-md w-full rounded-3xl shadow-md shadow-teal-200 p-8 border border-slate-100">

        {/* Logo o título del sistema */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold text-blue-600">CKAT</h1>
          <p className="text-sm text-slate-500 mt-2">Gestión de Turnos y Pacientes Kinesiología</p>
        </div>
      
        {isLoginView ? (
          <div>
            <LoginForm onLogin={handleLogin} />
            <div className="mt-6 text-center text-sm text-slate-600">
              <p>¿No tienes una cuenta?</p>
                <button onClick={() => setIsLoginView(false)}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Registrarse como Kinesiologo
                </button>
            </div>
          </div>
        ) : (
          <RegisterUserForm
            onRegister={handleRegister}
            onBackToLogin={() => setIsLoginView(true)}
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;