// Polyfill para useBackButton en web
import { useEffect } from 'react';

export const useBackButton = (callback) => {
  useEffect(() => {
    const handlePopState = () => {
      if (callback) {
        callback();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [callback]);
};

export default useBackButton;
