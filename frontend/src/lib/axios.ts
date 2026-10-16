import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api;

export const request = ({ ...options }) => {
  // Remove manual token handling since authentication is via HTTP-only cookies
  return api(options)
    .then((response) => {
      return response; 
    })
    .catch((error) => {
      console.error("API request error:", error)
      throw error; 
    });
}; 