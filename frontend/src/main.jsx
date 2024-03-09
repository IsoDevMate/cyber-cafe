import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import  './styles/output.css'
import { AuthProvider } from "../src/auth/context/auth"
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "../src/admin/context";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <ThemeProvider>
      <MaterialTailwindControllerProvider>
      <AuthProvider>
      <App />
      </AuthProvider>
      </MaterialTailwindControllerProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
