import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { VaultProvider } from './context/VaultContext'
import { SidebarProvider } from './context/SidebarContext'
import FormVaultPage from './pages/FormVaultPage'
import TagsPage from './pages/FormTagsPage'
import NotFound from './pages/NotFound'
import VaultPage from './pages/VaultPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <VaultProvider>
      <SidebarProvider>
        <div className="flex min-h-screen pt-8">
          <Sidebar />
          <main className="flex-1 ml-0 transition-all duration-300">
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<FormVaultPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/vault/:vaultId" element={<VaultPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
        </div>
      </SidebarProvider>
    </VaultProvider>

  )
}

export default App
