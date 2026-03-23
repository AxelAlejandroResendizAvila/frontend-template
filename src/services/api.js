const API_URL = "http://localhost:4000/api"; // Importante colocar la url de tu api

const buildHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const buildError = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const error = new Error(data?.message || `Error HTTP: ${response.status}`);
  error.status = response.status;
  error.data = data;
  return error;
};

const handleUnauthorized = () => {
  localStorage.removeItem('token');

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const api = {

  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: buildHeaders()
      });

      if (!response.ok) {
        const error = await buildError(response);
        if (response.status === 401) handleUnauthorized();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("Error en GET:", error);
      throw error;
    }
  },
  
  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await buildError(response);
        if (response.status === 401) handleUnauthorized();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("Error en POST:", error);
      throw error;
    }
  }
};