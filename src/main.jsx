import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ReactPWAInstallProvider from 'react-pwa-install'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactPWAInstallProvider>
        <App />
      </ ReactPWAInstallProvider>
    </BrowserRouter>
  </React.StrictMode >,
)
