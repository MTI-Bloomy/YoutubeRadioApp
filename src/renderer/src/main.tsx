import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { metricsService } from './services/metrics'
import './styles/index.css'

void metricsService.connect()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
