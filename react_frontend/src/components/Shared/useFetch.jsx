// src/components/shared/useFetch.jsx

import { useState, useEffect } from 'react';
import api from '../api.jsx'; // api.js에서 export한 api 객체를 가져옴

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`[useFetch] Called with URL: ${url}`); // URL 확인
      setIsLoading(true);
      try {
        const response = await api.get(url); // api.get() 메서드를 사용
        console.log('[useFetch] API Response Data:', response.data); // 응답 데이터 확인
        setData(response.data);
      } catch (err) {
        setError(`[useFetch] Error fetching from ${url}: ${err.message}`);
        console.error(`[useFetch] Error fetching from ${url}:`, err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;
