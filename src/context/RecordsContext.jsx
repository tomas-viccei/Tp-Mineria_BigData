import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../services/api';

const RecordsContext = createContext(null);

const normalizeKeys = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.toLowerCase().replace(/\s+/g, '_'),
      value,
    ])
  );
};

const normalizeList = (items) =>
  Array.isArray(items) ? items.map(normalizeKeys) : [];

export const RecordsProvider = ({ children }) => {
  const [tactos, setTactos] = useState([]);
  const [pariciones, setPariciones] = useState([]);
  const [proximosNacimientos, setProximosNacimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  const fetchAll = useCallback(async () => {
    if (!hasLoaded.current) setIsLoading(true);
    setError(null);
    try {
      const [tactosRes, paricionesRes, proximosRes] = await Promise.allSettled([
        api.tactos.getAll(),
        api.pariciones.getAll(),
        api.tactos.getProximos(),
      ]);

      if (tactosRes.status === 'fulfilled') {
        const data = tactosRes.value;
        const items = Array.isArray(data) ? data : (data.datos || data.data || []);
        setTactos(normalizeList(items));
      }

      if (paricionesRes.status === 'fulfilled') {
        const data = paricionesRes.value;
        const items = Array.isArray(data) ? data : (data.datos || data.data || []);
        setPariciones(normalizeList(items));
      }

      if (proximosRes.status === 'fulfilled') {
        const data = proximosRes.value;
        const items = Array.isArray(data) ? data : (data.datos || data.data || []);
        setProximosNacimientos(normalizeList(items));
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
      hasLoaded.current = true;
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
