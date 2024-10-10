import axios from "axios";
import getCurrentUser from "./getCurrentUser"; 

 // Adjust the path accordingly

const newRequest = axios.create({
  baseURL: "https://prolancer-backend.onrender.com/api/",
  withCredentials: true,
});


newRequest.interceptors.request.use(
  (config) => {
    const currentUser = getCurrentUser(); 

    // Check if the user and token exist
    if (currentUser && currentUser.token) {
      config.headers.Authorization = `Bearer ${currentUser.token}`; // Add token to request header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
