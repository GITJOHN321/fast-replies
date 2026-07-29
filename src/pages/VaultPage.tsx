import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { NoteAccordion } from '../components/NoteAccordion'
import { VaultHeader } from '../components/VaultHeader'
import { NoteToolbar } from '../components/NoteToolbar'
import { FilterBar } from '../components/FilterBar'
import { useVaults } from '../context/VaultContext'
import { useSidebar } from '../context/SidebarContext'
import { useVaultKeyboardNav } from '../controllers/controlVaultPage'
import { useClickOutside } from '../hooks/useClickOutside'
import { exportSelectedNotes } from '../application/exportNotes'
import { parseImportFile } from '../application/importVault'

function VaultPage() {
  const navigate = useNavigate()
  const { vaultId } = useParams<{ vaultId: string }>()
  const { vaults, tags, addNote, updateNote, updateNoteTitle, updateVaultTitle, deleteNotes, deleteVault, toggleNoteTag, importNotesIntoVault } = useVaults()
  const { sidebarOpen } = useSidebar()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [focusedNavId, setFocusedNavId] = useState<string | null>(null)
  const [editingVaultTitle, setEditingVaultTitle] = useState(false)
  const [vaultEditValue, setVaultEditValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [editingNavTitleId, setEditingNavTitleId] = useState<string | null>(null)
  const vaultInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const importFileRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const vault = vaults.find((v) => v.id === vaultId)

  const filtered = useMemo(
    () =>
      (vault?.notes ?? []).filter((note) => {
        const matchSearch =
          !search ||
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.description.toLowerCase().includes(search.toLowerCase())

        const matchTags =
          filterTags.length === 0 ||
          filterTags.every((tagId) => note.tags.includes(tagId))

        return matchSearch && matchTags
      }),
    [vault?.notes, search, filterTags],
  )

  useClickOutside(menuRef, menuOpen, () => setMenuOpen(false))

  useEffect(() => {
    if (editingVaultTitle && vaultInputRef.current) {
      vaultInputRef.current.focus()
      vaultInputRef.current.select()
    }
  }, [editingVaultTitle])

  useEffect(() => {
    if (!editingNavTitleId) return
    const id = setTimeout(() => {
      if (editingNavTitleId) setEditingNavTitleId(null)
    }, 0)
    return () => clearTimeout(id)
  }, [editingNavTitleId])

  if (!vault) {
    return (
      <div className="page-wrapper">
        <div className="w-full max-w-md">
          <h1 className="page-title">Vault not found</h1>
          <Link to="/" className="text-accent hover:underline text-sm">Back to home</Link>
        </div>
      </div>
    )
  }

  const toggleNote = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAddNote = () => {
    addNote(vault.id)
    setExpandedId(null)
  }

  useVaultKeyboardNav(focusedNavId, setFocusedNavId, setExpandedId, filtered, sidebarOpen, setEditingNavTitleId, handleAddNote, () => searchRef.current?.focus())

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)))
    }
  }

  const handleDeleteSelected = () => {
    const count = selectedIds.size
    if (count === 0) return
    if (window.confirm(`Are you sure you want to delete ${count} note${count > 1 ? 's' : ''}?`)) {
      deleteNotes(vault.id, Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const startEditVaultTitle = () => {
    setVaultEditValue(vault.title)
    setEditingVaultTitle(true)
  }

  const commitVaultTitle = () => {
    const trimmed = vaultEditValue.trim()
    if (trimmed && trimmed !== vault.title) {
      updateVaultTitle(vault.id, trimmed)
    }
    setEditingVaultTitle(false)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMenuOpen(false)

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string)
        const payload = parseImportFile(json)
        importNotesIntoVault(vault.id, payload)
      } catch {
        // silently ignore invalid files
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleToggleTag = (tagId: string) => {
    setFilterTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    )
  }

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-md">
        {!focusedNavId && (
          <>
            <VaultHeader
              vault={vault}
              tags={tags}
              editingTitle={editingVaultTitle}
              editValue={vaultEditValue}
              menuOpen={menuOpen}
              vaultInputRef={vaultInputRef}
              menuRef={menuRef}
              importFileRef={importFileRef}
              onEditValueChange={setVaultEditValue}
              onStartEdit={startEditVaultTitle}
              onCommitTitle={commitVaultTitle}
              onCancelEdit={() => setEditingVaultTitle(false)}
              onToggleMenu={() => setMenuOpen((p) => !p)}
              onDeleteVault={() => { if (window.confirm(`Delete vault "${vault.title}" and all its notes?`)) { deleteVault(vault.id); navigate('/') } }}
              onImportFile={handleImportFile}
            />

            <NoteToolbar
              onAddNote={handleAddNote}
              selectedCount={selectedIds.size}
              onDeleteSelected={handleDeleteSelected}
              onExportSelected={() =>
                exportSelectedNotes(
                  vault.notes.filter((n) => selectedIds.has(n.id)),
                  vault,
                  tags,
                )
              }
            />
          </>
        )}

        <div className="space-y-3 mb-6">
          {focusedNavId && (
            <p className="text-xs text-accent">
              <kbd className="text-text border border-border px-1 rounded">Ctrl+E</kbd> start,{' '}
              <kbd className="text-text border border-border px-1 rounded">↑</kbd>{' '}
              <kbd className="text-text border border-border px-1 rounded">↓</kbd> navigate,{' '}
              <kbd className="text-text border border-border px-1 rounded">Ctrl+F</kbd> search,{' '}
              <kbd className="text-text border border-border px-1 rounded">Ctrl+T</kbd> edit title,{' '}
              <kbd className="text-text border border-border px-1 rounded">+</kbd> new note,{' '}
              <kbd className="text-text border border-border px-1 rounded">Ctrl+C</kbd> copy,{' '}
              <kbd className="text-text border border-border px-1 rounded">Esc</kbd> exit
            </p>
          )}
          {!focusedNavId && (
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              tags={tags}
              filterTags={filterTags}
              onToggleTag={handleToggleTag}
              noteCount={filtered.length}
              selectedCount={selectedIds.size}
              onSelectAll={handleSelectAll}
              searchRef={searchRef}
            />
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-text-dim text-sm">No notes match your criteria.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((note) => (
              <NoteAccordion
                key={note.id}
                note={note}
                tags={tags}
                expanded={expandedId === note.id}
                selected={selectedIds.has(note.id)}
                focused={focusedNavId === note.id}
                editingTitleFromNav={editingNavTitleId === note.id}
                onToggle={toggleNote}
                onSelectChange={toggleSelect}
                onDescriptionChange={(noteId, description) =>
                  updateNote(vault.id, noteId, description)
                }
                onTitleChange={(noteId, title) =>
                  updateNoteTitle(vault.id, noteId, title)
                }
                onToggleTag={(noteId, tagId) =>
                  toggleNoteTag(vault.id, noteId, tagId)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VaultPage
