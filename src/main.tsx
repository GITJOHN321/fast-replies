import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { UserProvider } from './context/UserContext'
import { Banner } from './components/Banner'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Banner />
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
