import axios from "axios";
import getCurrentUser from "./getCurrentUser"; // Adjust the path accordingly

const newRequest = axios.create({
  baseURL: "https://prolancer-backend.onrender.com/api/",
  withCredentials: true,
});

newRequest.interceptors.request.use(
  (config) => {
    const currentUser = getCurrentUser();

    
    if (currentUser) {
     
      config.headers.Authorization = `Bearer ${currentUser.token || ''}`; 
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;



// import axios from "axios";
// import getCurrentUser from "./getCurrentUser"; 

 

// const newRequest = axios.create({
//   baseURL: "https://prolancer-backend.onrender.com/api/",
//   withCredentials: true,
// });


// newRequest.interceptors.request.use(
//   (config) => {
//     const currentUser = getCurrentUser(); 

    
//     if (currentUser && currentUser.token) {
//       config.headers.Authorization = `Bearer ${currentUser.token}`; 
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

//export default newRequest;
