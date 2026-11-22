import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import App from './App';
import { SessionProvider } from './context/SessionContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <SessionProvider><App /></SessionProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
