import axios from "axios"

const ApiInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
        "Content-Type": "application/json",
    }
})

ApiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

ApiInstance.interceptors.response.use((response: any) => {
    return response
}, (error: any) => {
    if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
})

export default ApiInstance