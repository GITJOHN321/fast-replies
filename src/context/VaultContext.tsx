import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useUser } from './UserContext'
import type { ImportPayload } from '../application/importVault'
import type { Vault, Tag } from '../domain/entities'
import { LocalStorageVaultRepo } from '../infrastructure/localStorageRepo'
import * as service from '../application/vaultService'

type VaultContextType = {
  vaults: Vault[]
  tags: Tag[]
  addVault: (vaultname: string) => void
  addNote: (vaultId: string) => void
  updateNote: (vaultId: string, noteId: string, content: string) => void
  updateNoteTitle: (vaultId: string, noteId: string, notename: string) => void
  updateVaultTitle: (vaultId: string, vaultname: string) => void
  deleteNotes: (vaultId: string, noteIds: string[]) => void
  deleteVault: (vaultId: string) => void
  addTag: (name: string) => void
  removeTag: (tagId: string) => void
  toggleNoteTag: (vaultId: string, noteId: string, tagId: string) => void
  importVault: (data: ImportPayload) => string
  importNotesIntoVault: (vaultId: string, data: ImportPayload) => void
}

const VaultContext = createContext<VaultContextType | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const userId = user?.id_user

  const repo = useMemo(
    () => (userId ? new LocalStorageVaultRepo(userId) : null),
    [userId],
  )

  const [vaults, setVaults] = useState<Vault[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    if (repo) {
      setVaults(repo.loadVaults())
      setTags(repo.loadTags())
    } else {
      setVaults([])
      setTags([])
    }
  }, [repo])

  const persist = useCallback((nextVaults: Vault[], nextTags?: Tag[]) => {
    setVaults(nextVaults)
    repo?.saveVaults(nextVaults)
    if (nextTags) {
      setTags(nextTags)
      repo?.saveTags(nextTags)
    }
  }, [repo])

  const addVault = (vaultname: string) =>
    persist(service.addVault(vaults, vaultname))

  const addNote = (vaultId: string) =>
    persist(service.addNote(vaults, vaultId))

  const updateNote = (vaultId: string, noteId: string, content: string) =>
    persist(service.updateNote(vaults, vaultId, noteId, content))

  const updateNoteTitle = (vaultId: string, noteId: string, notename: string) =>
    persist(service.updateNoteName(vaults, vaultId, noteId, notename))

  const updateVaultTitle = (vaultId: string, vaultname: string) =>
    persist(service.updateVaultName(vaults, vaultId, vaultname))

  const deleteNotes = (vaultId: string, noteIds: string[]) =>
    persist(service.deleteNotes(vaults, vaultId, noteIds))

  const deleteVault = (vaultId: string) =>
    persist(service.deleteVault(vaults, vaultId))

  const addTag = (name: string) => {
    const next = service.addTag(tags, name)
    setTags(next)
    repo?.saveTags(next)
  }

  const removeTag = (tagId: string) => {
    const { vaults: nextVaults, tags: nextTags } = service.removeTag(vaults, tags, tagId)
    persist(nextVaults, nextTags)
  }

  const toggleNoteTag = (vaultId: string, noteId: string, tagId: string) =>
    persist(service.toggleNoteTag(vaults, vaultId, noteId, tagId))

  const importVault = (data: ImportPayload): string => {
    const result = service.importVault(vaults, tags, data)
    persist(result.vaults, result.tags)
    return result.vaultId
  }

  const importNotesIntoVault = (vaultId: string, data: ImportPayload) => {
    const result = service.importNotesIntoVault(vaults, tags, vaultId, data)
    persist(result.vaults, result.tags)
  }

  return (
    <VaultContext.Provider
      value={{ vaults, tags, addVault, addNote, updateNote, updateNoteTitle, updateVaultTitle, deleteNotes, deleteVault, addTag, removeTag, toggleNoteTag, importVault, importNotesIntoVault }}
    >
      {children}
    </VaultContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVaults() {
  const ctx = useContext(VaultContext)
  if (!ctx) throw new Error('useVaults must be used within VaultProvider')
  return ctx
}
