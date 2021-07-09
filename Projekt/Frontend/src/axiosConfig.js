import axios from "axios";
const instance = axios.create();
instance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("user-token");
      if (token) {
        config.headers.Authorization =
          "Bearer " + localStorage.getItem("user-token");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
