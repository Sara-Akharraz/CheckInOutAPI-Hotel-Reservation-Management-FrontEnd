import axios from 'axios'

const axiosInstance = axios.create({
    headers: {
        'Content-type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const email = "Hasnae@example.com";
        const password = "Hasnae";
        if(email && password){
            config.auth = {
                username: email,
                password: password
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance