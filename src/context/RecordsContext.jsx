import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

const RecordsContext = createContext(null);

export const RecordsProvider = ({ children }) => {
  const [tactos, setTactos] = useState([]);
  const [pariciones, setPariciones] = useState([]);
  const [proximosNacimientos, setProximosNacimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tactosRes, paricionesRes, proximosRes] = await Promise.allSettled([
        api.tactos.getAll(),
        api.pariciones.getAll(),
        api.tactos.getProximos(),
      ]);

      if (tactosRes.status === 'fulfilled') {
        const data = tactosRes.value;
        setTactos(Array.isArray(data) ? data : (data.datos || data.data || []));
      }

      if (paricionesRes.status === 'fulfilled') {
        const data = paricionesRes.value;
        setPariciones(Array.isArray(data) ? data : (data.datos || data.data || []));
      }

      if (proximosRes.status === 'fulfilled') {
        const data = proximosRes.value;
        setProximosNacimientos(Array.isArray(data) ? data : (data.datos || data.data || []));
      }

      const allRejected = [tactosRes, paricionesRes, proximosRes].every(
        (r) => r.status === 'rejected'
      );
      if (allRejected) {
        setError('No se pudo conectar con el servidor. Verifique la configuración de la API.');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <RecordsContext.Provider
      value={{ tactos, pariciones, proximosNacimientos, isLoading, error, refetch: fetchAll }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error('useRecords debe usarse dentro de un RecordsProvider');
  }
  return context;
};
