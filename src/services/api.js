import axios from 'axios';
import { CEP_API_BASE_URL } from '@env';

const api = axios.create({
    baseURL: CEP_API_BASE_URL
});

export default api;
