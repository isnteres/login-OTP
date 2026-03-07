import { useState, useEffect } from 'react';

export const useInicio = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);


        const userRaw = localStorage.getItem('user');
        const user    = userRaw ? JSON.parse(userRaw) : null;

        const response = await fetch('http://localhost:8000/api/dashboard/stats', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del panel de inicio');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading, error };
};