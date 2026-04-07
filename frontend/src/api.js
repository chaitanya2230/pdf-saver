import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (window.location.port === '5173' ? 'http://localhost:8000/api' : '/api'),
});

export default api;
