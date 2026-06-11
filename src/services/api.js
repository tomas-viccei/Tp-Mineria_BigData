const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/webhook';

const fetchApi = async (endpoint, options = {}) => {
  // Correccion: Se garantiza la barra divisoria entre la URL base y el endpoint
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }

    const error = new Error(
      errorData.error || errorData.message || `Error HTTP ${response.status}: ${response.statusText}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
};

export const api = {
  tactos: {
    create: (data) =>
      fetchApi('api/tacto', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => fetchApi('api/tactos'),
    getProximos: () => fetchApi('api/tactos/proximos'),
  },
  pariciones: {
    create: (data) =>
      fetchApi('api/paricion', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => fetchApi('api/pariciones'),
  },
};