import axios from 'axios';

// Crea una instancia de axios con la configuración base de tu API
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // Reemplaza con la URL de tu backend
});

// **¡Clave!** Interceptor para añadir el token de autenticación a cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Leemos el token guardado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;