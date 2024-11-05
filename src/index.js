import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react'; // Importa ChakraProvider
import './index.css';
import 'leaflet/dist/leaflet.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider> {/* ChakraProvider debe envolver a App */}
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// Si quieres medir el rendimiento en tu app, pasa una función como argumento a reportWebVitals.
reportWebVitals();
