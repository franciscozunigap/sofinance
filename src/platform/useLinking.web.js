// Polyfill para useLinking en web
import { useEffect, useRef } from 'react';

export const useLinking = (ref, config) => {
  const linking = useRef({
    getInitialURL: () => {
      return Promise.resolve(window.location.href);
    },
    getStateFromPath: (path, options) => {
      // Implementación básica para web
      return {
        routes: [{ name: 'Home', path }],
        index: 0,
      };
    },
    getPathFromState: (state, options) => {
      // Implementación básica para web
      return '/';
    },
  });

  useEffect(() => {
    if (config) {
      // Configurar linking si es necesario
    }
  }, [config]);

  return linking.current;
};

export default useLinking;
