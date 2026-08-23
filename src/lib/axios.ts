import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { APP_CONFIG } from '@/config/app.config';

export const axiosInstance = axios.create({
  baseURL:         API_CONFIG.baseUrl,
  timeout:         API_CONFIG.timeout,
  withCredentials: true,
  headers: {
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'X-Client-Name': APP_CONFIG.name,
    'X-Client-Version': APP_CONFIG.version,
  },
});

export default axiosInstance;
