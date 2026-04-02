import axios from 'axios';

const api = axios.create({
    // Vite usa 'import.meta.env' para leer el archivo .env
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 40000, // 40 segundos de espera
    headers: {
        'Content-Type': 'application/json', // header original
    }
});

// Interceptor de Petición 
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de Respuesta para manejar el "jwt expired"
api.interceptors.response.use(
    (response) => response, // Si la respuesta es OK, no se hace nada
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el token expiró o es inválido
            localStorage.removeItem('token'); // Limpiar el token basura
            window.location.href = '/iniciar-sesion'; // Redirigir al login
        }
        return Promise.reject(error);
    }
);

export default api;