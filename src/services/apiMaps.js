import axios from 'axios';
import { MAPS_BASE_URL } from '@env';

const apiMaps = axios.create({
    baseURL: MAPS_BASE_URL
});

export default apiMaps;
