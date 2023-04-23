import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function apiRequest(url, method = "GET", data = {}, params = {}) {
  return client
    .request({
      url,
      method,
      data,
      params,
    })
    .then((res) => res.data);
}
export default apiRequest;
