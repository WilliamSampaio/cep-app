import axios from 'axios';
import { VIACEP_BASE_URL } from '@env';

const apiViaCep = axios.create({
    baseURL: VIACEP_BASE_URL
});

export default apiViaCep;
