// Configuración específica para web
export const Platform = {
  OS: 'web',
  select: (obj) => obj.web || obj.default,
};

export const Dimensions = {
  get: (dimension) => {
    if (dimension === 'window') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
};

export const StatusBar = {
  setBarStyle: () => {},
  setBackgroundColor: () => {},
  setTranslucent: () => {},
};

export const Alert = {
  alert: (title, message, buttons) => {
    if (window.confirm(`${title}\n\n${message}`)) {
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  },
};

export const ActivityIndicator = ({ size, color, style }) => {
  const React = require('react');
  return React.createElement('div', {
    style: {
      width: size === 'large' ? '40px' : '20px',
      height: size === 'large' ? '40px' : '20px',
      border: `4px solid #e5e7eb`,
      borderTop: `4px solid ${color || '#4f46e5'}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      ...style,
    },
  });
};

// SafeAreaContext para web
export const SafeAreaProvider = ({ children }) => {
  const React = require('react');
  return React.createElement('div', { children });
};

export const SafeAreaView = ({ children, style, ...props }) => {
  const React = require('react');
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
