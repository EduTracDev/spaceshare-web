import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject the token into every single request
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Handle global errors (like redirecting to login if token expires)
// api.interceptors.response.use((response) => response, (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid -> redirect to login or refresh token
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//       }
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );