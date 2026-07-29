import { useRef, useState } from 'react'
import { useVaults } from '../context/VaultContext'

function FormVaultPage() {
  const { addVault } = useVaults()
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const title = inputRef.current?.value.trim()
    if (!title) return
    addVault(title)
    inputRef.current!.value = ''
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-md">
        <h1 className="page-title">Vaults</h1>
        <div className="form-card">
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="input-label">Title</label>
              <input
                ref={inputRef}
                id="title"
                placeholder="Vault title"
                className="input-field"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              />
            </div>
            <button onClick={handleSubmit} className="btn-primary">Create Vault</button>
            {success && (
              <p className="text-sm text-green-400 text-center">Vault Creado exitosamente!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormVaultPage
