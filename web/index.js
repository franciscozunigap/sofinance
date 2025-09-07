import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

// Punto de entrada para la aplicación web
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
