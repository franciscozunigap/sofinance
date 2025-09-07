// Mock de SafeAreaContext para web
import React from 'react';

const SafeAreaContext = React.createContext({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const SafeAreaProvider = ({ children }) => {
  return React.createElement('div', { children });
};

export const SafeAreaView = ({ children, style, ...props }) => {
  return React.createElement('div', { 
    style: { 
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      ...style 
    }, 
    ...props, 
    children 
  });
};

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export default SafeAreaContext;
