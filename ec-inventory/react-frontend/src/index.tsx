import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// BootstrapのCSS
import 'bootstrap/dist/css/bootstrap.min.css';
// プロジェクト独自CSS (必要なら)
import './index.css';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
