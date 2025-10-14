import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
};

const api = axios.create(config);