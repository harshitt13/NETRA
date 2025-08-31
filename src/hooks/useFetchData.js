import { useState, useEffect, useCallback } from 'react';

// The base URL for our Flask API, configured to work in development
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * A custom React hook for fetching data from the backend API.
 * @param {string} initialUrl - The API endpoint to fetch data from (e.g., '/alerts').
 * @returns {{data: any, loading: boolean, error: Error|null, refetch: function}}
 */
const useFetchData = (initialUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(initialUrl);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to allow components to manually trigger a refetch
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetchData;
