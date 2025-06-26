'use client';

import { useState, useEffect } from 'react';

// Simple in-memory cache
const cache = new Map();

export default function useFetch(url, options = {}) {
  const { revalidate = 60000 } = options; // Revalidate after 1 minute by default
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      // Check if we have cached data and it's not stale
      const cachedData = cache.get(url);
      if (cachedData && Date.now() - cachedData.timestamp < revalidate) {
        setData(cachedData.data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(url, { signal });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Cache the result with a timestamp
        cache.set(url, {
          data: result,
          timestamp: Date.now()
        });
        
        setData(result);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching data:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, revalidate]);

  return { data, loading, error };
}
