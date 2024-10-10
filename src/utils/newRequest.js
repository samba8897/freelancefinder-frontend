import axios from "axios";


const apiUrl = process.env.REACT_APP_API_URL;

const newRequest = axios.create({
  baseURL: apiUrl, 
  withCredentials: true,
});


newRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
