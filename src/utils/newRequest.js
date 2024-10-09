import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://prolancer-backend.onrender.com/api/",
  withCredentials: true,
});

// Interceptor to add Authorization token to requests
newRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Adjust based on where you're storing the token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default newRequest;

