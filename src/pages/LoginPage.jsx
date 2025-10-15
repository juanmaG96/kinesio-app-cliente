import React, {useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../Components/auth/LoginForm';
import RegisterUserForm from '../Components/User/RegisterUserForm';
import apiClient from '../api/axiosConfig'; // Importamos nuestro cliente axios
import styles from './LoginPage.module.css';

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
    <div className={styles.pageContainer}>
      {isLoginView ? (
        <div>
          <LoginForm onLogin={handleLogin} />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>¿No tienes una cuenta?</p>
              <button onClick={() => setIsLoginView(false)}>
                Registrarse
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
  );
}

export default LoginPage;