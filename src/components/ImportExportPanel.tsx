import { useState, useRef } from 'react'
import type { Vault, Tag } from '../domain/entities'
import type { ImportPayload } from '../application/importVault'
import { exportSelectedNotes } from '../application/exportNotes'
import { parseImportFile } from '../application/importVault'

type Props = {
  vaults: Vault[]
  tags: Tag[]
  onImport: (data: ImportPayload) => string
}

export function ImportExportPanel({ vaults, tags, onImport }: Props) {
  const [showExportList, setShowExportList] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = (vault: Vault) => {
    exportSelectedNotes(vault.notes, vault, tags)
    setShowExportList(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportStatus('idle')
    setImportMessage('')

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string)
        const payload = parseImportFile(json)
        onImport(payload)
        setImportStatus('success')
        setImportMessage(`Imported "${payload.title}" with ${payload.notes.length} notes.`)
      } catch (err) {
        setImportStatus('error')
        setImportMessage(err instanceof Error ? err.message : 'Import failed.')
      }
    }
    reader.onerror = () => {
      setImportStatus('error')
      setImportMessage('Failed to read file.')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="form-card space-y-3">
      <h2 className="text-sm font-semibold text-text tracking-wide uppercase">
        Import / Export Vaults
      </h2>
      <p className="text-xs text-text-dim">
        Export your vaults and notes as JSON, or import data from a previous export.
      </p>

      {importStatus !== 'idle' && (
        <p className={`text-xs ${importStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {importMessage}
        </p>
      )}

      {showExportList ? (
        <div className="space-y-1">
          <p className="text-xs text-text-dim mb-1">Select a vault to export:</p>
          {vaults.length === 0 && (
            <p className="text-xs text-text-dim">No vaults available.</p>
          )}
          {vaults.map((vault) => (
            <button
              key={vault.id}
              onClick={() => handleExport(vault)}
              className="w-full text-left px-3 py-2 bg-surface border border-border rounded-md text-sm text-text
                         hover:bg-card/80 transition-colors cursor-pointer"
            >
              {vault.title}
              <span className="text-text-dim ml-2">({vault.notes.length} notes)</span>
            </button>
          ))}
          <button
            onClick={() => setShowExportList(false)}
            className="text-xs text-text-dim hover:text-text transition-colors cursor-pointer mt-1"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setShowExportList(true)} className="btn-primary !w-auto px-4">
            Export
          </button>
          <button onClick={handleImportClick} className="btn-primary !w-auto px-4">
            Import
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
