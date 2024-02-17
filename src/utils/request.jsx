import axios from 'axios';
import { getToken } from './token';

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000
});

request.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = getToken();
        const { url } = config
        if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/register')) {
            config.headers.authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default request;