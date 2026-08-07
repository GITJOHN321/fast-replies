import { type RefObject } from 'react'
import type { Vault, Tag } from '../domain/entities'
import { exportSelectedNotes } from '../application/exportNotes'

type Props = {
  vault: Vault
  tags: Tag[]
  editingTitle: boolean
  editValue: string
  menuOpen: boolean
  vaultInputRef: RefObject<HTMLInputElement | null>
  menuRef: RefObject<HTMLDivElement | null>
  importFileRef: RefObject<HTMLInputElement | null>
  onEditValueChange: (value: string) => void
  onStartEdit: () => void
  onCommitTitle: () => void
  onCancelEdit: () => void
  onToggleMenu: () => void
  onDeleteVault: () => void
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function VaultHeader({
  vault, tags, editingTitle, editValue, menuOpen,
  vaultInputRef, menuRef, importFileRef,
  onEditValueChange, onStartEdit, onCommitTitle, onCancelEdit,
  onToggleMenu, onDeleteVault, onImportFile,
}: Props) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {editingTitle ? (
        <input
          ref={vaultInputRef}
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={onCommitTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onCommitTitle()
            if (e.key === 'Escape') onCancelEdit()
          }}
          className="flex-1 bg-transparent text-2xl font-semibold text-text outline-none border-b border-accent"
        />
      ) : (
        <>
          <h1 className="page-title flex-1 mb-0">{vault.vaultname}</h1>
          <div ref={menuRef} className="relative">
            <button
              onClick={onToggleMenu}
              className="text-text-dim hover:text-text cursor-pointer text-lg px-1"
              title="Vault actions"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-md shadow-lg z-50 py-1">
                <button
                  onClick={() => { onStartEdit(); onToggleMenu() }}
                  className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => { importFileRef.current?.click(); onToggleMenu() }}
                  className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface transition-colors cursor-pointer"
                >
                  Import Notes
                </button>
                <button
                  onClick={() => { exportSelectedNotes(vault.notes, vault, tags); onToggleMenu() }}
                  className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface transition-colors cursor-pointer"
                >
                  Export Vault
                </button>
                <hr className="border-border my-1" />
                <button
                  onClick={() => { onToggleMenu(); onDeleteVault() }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <input
            ref={importFileRef}
            type="file"
            accept=".json"
            onChange={onImportFile}
            className="hidden"
          />
        </>
      )}
    </div>
  )
}
