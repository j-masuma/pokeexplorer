import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { PokemonProvider } from './context/PokemonContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <PokemonProvider>
          <App />
        </PokemonProvider>
      </BrowserRouter>    
    </StrictMode>,
)
