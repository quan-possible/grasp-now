import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppDemo from './App.demo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDemo />
  </StrictMode>,
)
