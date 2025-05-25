const API_BASE = import.meta.env.VITE_API_BASE;

export default {
  get: (url, config) => axios.get(API_BASE + url, config),
  post: (url, data, config) => axios.post(API_BASE + url, data, config),
  put: (url, data) => axios.put(API_BASE + url, data),
  delete: (url) => axios.delete(API_BASE + url)
};
