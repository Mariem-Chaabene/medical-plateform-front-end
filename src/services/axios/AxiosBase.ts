import axios from 'axios'
// import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
// import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import endpointConfig from '@/configs/endpoint.config'
// import type { AxiosError } from 'axios'

const AxiosBase = axios.create({
    baseURL: endpointConfig.baseURL || 'http://127.0.0.1:8000/api', // <- ton backend Laravel
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

AxiosBase.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token invalide ou expiré -> on peut rediriger vers /login
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    },
)

export default AxiosBase
