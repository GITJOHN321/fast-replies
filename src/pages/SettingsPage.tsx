import { useVaults } from '../context/VaultContext'
import { useAppMode } from '../hooks/useAppMode'
import { ImportExportPanel } from '../components/ImportExportPanel'
import { AppearanceSettings } from '../components/AppearanceSettings'
import { AuthSettings } from '../components/AuthSettings'

function SettingsPage() {
  const { vaults, tags, importVault } = useVaults()
  const [mode, setMode] = useAppMode()

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-md space-y-6">
        <h1 className="page-title">Settings</h1>
        <ImportExportPanel vaults={vaults} tags={tags} onImport={importVault} />
        <AppearanceSettings mode={mode} onModeChange={setMode} />
        <AuthSettings />
      </div>
    </div>
  )
}

export default SettingsPage
