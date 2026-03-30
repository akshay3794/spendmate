import axios from "axios";
import { BASE_URL } from "./apiUrls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";

const TIMEOUT = 10000;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {    
    const status = error.response?.status;
    if (error.code === "ECONNABORTED") {
      console.log("⏰ Request timed out:", error.config?.url);
    } else if (status === 401) {
      console.log("🔐 Unauthorized! Invalid token.");
      EventRegister.emit("FORCE_LOGOUT");
    } else if (error.response) {
      console.log(
        `❌ API Error [${error.response.status}]:`,
        error.response.data
      );
    } else {
      console.log("⚠️ Unknown API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
