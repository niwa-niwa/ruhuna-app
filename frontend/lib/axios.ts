import axios from "axios";

export const restClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
  timeout: 1000,
});
