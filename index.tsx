// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// React Router を使うためのいろいろなもの
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './Routes.tsx' // Routes.jsxを参照

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)
