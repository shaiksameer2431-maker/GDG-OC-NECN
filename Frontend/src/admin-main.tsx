import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminMobileApp } from './admin/AdminMobileApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminMobileApp />
  </React.StrictMode>
);
