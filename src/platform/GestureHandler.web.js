// Polyfill para GestureHandler en web
import React from 'react';

// Estados de gestos
export const GestureState = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
};

// Componentes de gestos (simulados para web)
export const PanGestureHandler = ({ children, onGestureEvent, onHandlerStateChange, ...props }) => {
  return React.createElement('div', { 
    ...props, 
    children 
  });
};

export const GestureHandlerRootView = ({ children, style, ...props }) => {
  return React.createElement('div', { 
    style: { 
      flex: 1,
      ...style 
    }, 
    ...props, 
    children 
  });
};

// Hooks simulados
export const useGestureHandler = () => ({
  onGestureEvent: () => {},
  onHandlerStateChange: () => {},
});

export default {
  GestureState,
  PanGestureHandler,
  GestureHandlerRootView,
  useGestureHandler,
};
