import type { Vault, Note, Tag } from '../domain/entities'
import type { ImportPayload } from './importVault'

export function addVault(vaults: Vault[], title: string): Vault[] {
  const newVault: Vault = {
    id: crypto.randomUUID(),
    title,
    notes: [],
  }
  return [...vaults, newVault]
}

export function addNote(vaults: Vault[], vaultId: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id !== vaultId) return vault
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: `Generic Note ${vault.notes.length + 1}`,
      description: '',
      tags: [],
    }
    return { ...vault, notes: [...vault.notes, newNote] }
  })
}

export function updateNote(vaults: Vault[], vaultId: string, noteId: string, description: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id !== vaultId) return vault
    return {
      ...vault,
      notes: vault.notes.map((n) =>
        n.id === noteId ? { ...n, description } : n,
      ),
    }
  })
}

export function updateNoteTitle(vaults: Vault[], vaultId: string, noteId: string, title: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id !== vaultId) return vault
    return {
      ...vault,
      notes: vault.notes.map((n) =>
        n.id === noteId ? { ...n, title } : n,
      ),
    }
  })
}

export function updateVaultTitle(vaults: Vault[], vaultId: string, title: string): Vault[] {
  return vaults.map((v) => (v.id === vaultId ? { ...v, title } : v))
}

export function deleteNotes(vaults: Vault[], vaultId: string, noteIds: string[]): Vault[] {
  return vaults.map((vault) => {
    if (vault.id !== vaultId) return vault
    return { ...vault, notes: vault.notes.filter((n) => !noteIds.includes(n.id)) }
  })
}

export function deleteVault(vaults: Vault[], vaultId: string): Vault[] {
  return vaults.filter((v) => v.id !== vaultId)
}

export function addTag(tags: Tag[], name: string): Tag[] {
  return [...tags, { id: crypto.randomUUID(), name }]
}

export function removeTag(vaults: Vault[], tags: Tag[], tagId: string): { vaults: Vault[]; tags: Tag[] } {
  return {
    tags: tags.filter((t) => t.id !== tagId),
    vaults: vaults.map((vault) => ({
      ...vault,
      notes: vault.notes.map((n) => ({
        ...n,
        tags: n.tags.filter((id) => id !== tagId),
      })),
    })),
  }
}

export function toggleNoteTag(vaults: Vault[], vaultId: string, noteId: string, tagId: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id !== vaultId) return vault
    return {
      ...vault,
      notes: vault.notes.map((n) => {
        if (n.id !== noteId) return n
        const has = n.tags.includes(tagId)
        return {
          ...n,
          tags: has ? n.tags.filter((id) => id !== tagId) : [...n.tags, tagId],
        }
      }),
    }
  })
}

function resolveTags(tags: Tag[], noteTags: string[]): { resolved: Tag[]; tagNameToId: Record<string, string> } {
  const tagNameToId: Record<string, string> = {}
  const resolved = [...tags]

  for (const name of noteTags) {
    const existing = resolved.find((t) => t.name === name)
    if (existing) {
      tagNameToId[name] = existing.id
    } else {
      const id = crypto.randomUUID()
      tagNameToId[name] = id
      resolved.push({ id, name })
    }
  }

  return { resolved, tagNameToId }
}

export function importVault(
  vaults: Vault[],
  tags: Tag[],
  data: ImportPayload,
): { vaults: Vault[]; tags: Tag[]; vaultId: string } {
  const allTagNames = [...new Set(data.notes.flatMap((n) => n.tags))]
  const { resolved, tagNameToId } = resolveTags(tags, allTagNames)

  const vaultId = crypto.randomUUID()
  const newVault: Vault = {
    id: vaultId,
    title: data.title,
    notes: data.notes.map((n) => ({
      id: crypto.randomUUID(),
      title: n.title,
      description: n.description,
      tags: n.tags.map((t) => tagNameToId[t]),
    })),
  }

  return { vaults: [...vaults, newVault], tags: resolved, vaultId }
}

export function importNotesIntoVault(
  vaults: Vault[],
  tags: Tag[],
  vaultId: string,
  data: ImportPayload,
): { vaults: Vault[]; tags: Tag[] } {
  const allTagNames = [...new Set(data.notes.flatMap((n) => n.tags))]
  const { resolved, tagNameToId } = resolveTags(tags, allTagNames)

  const newNotes: Note[] = data.notes.map((n) => ({
    id: crypto.randomUUID(),
    title: n.title,
    description: n.description,
    tags: n.tags.map((t) => tagNameToId[t]),
  }))

  return {
    tags: resolved,
    vaults: vaults.map((v) =>
      v.id === vaultId ? { ...v, notes: [...v.notes, ...newNotes] } : v,
    ),
  }
}
