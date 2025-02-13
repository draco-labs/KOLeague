import { useEffect, useState } from 'react';

const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsMounted(true), 1000);
  }, []);
  return { isMounted };
};

export default useMounted;
