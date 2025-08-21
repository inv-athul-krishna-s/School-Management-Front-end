import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// 🔹 Attach token dynamically per activeRole (from sessionStorage)
instance.interceptors.request.use((config) => {
  const activeRole = sessionStorage.getItem("activeRole"); // "teacher" | "student"
  if (activeRole) {
    const token = sessionStorage.getItem(`${activeRole}_token`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🔹 Handle refresh logic
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const activeRole = sessionStorage.getItem("activeRole");

    if (error.response?.status === 401 && !originalRequest._retry && activeRole) {
      originalRequest._retry = true;
      const refresh = sessionStorage.getItem(`${activeRole}_refresh`);
      try {
        const res = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh,
        });

        // Save new token for that role (in sessionStorage)
        sessionStorage.setItem(`${activeRole}_token`, res.data.access);

        // Retry request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return axios(originalRequest);
      } catch (err) {
        // Clear only the active role’s session (this tab only)
        sessionStorage.removeItem(`${activeRole}_token`);
        sessionStorage.removeItem(`${activeRole}_refresh`);
        sessionStorage.removeItem("activeRole");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
