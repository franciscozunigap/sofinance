// Polyfill para MaskedView en web
import React from 'react';

const MaskedView = ({ children, style, ...props }) => {
  return React.createElement('div', { 
    style: { 
      overflow: 'hidden',
      ...style 
    }, 
    ...props, 
    children 
  });
};

// Exportar tanto como default como named export
export { MaskedView };
export default MaskedView;
