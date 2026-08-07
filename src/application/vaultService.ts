import type { Vault, Note, Tag } from '../domain/entities'
import type { ImportPayload } from './importVault'

export function addVault(vaults: Vault[], vaultname: string): Vault[] {
  const newVault: Vault = {
    id_vault: crypto.randomUUID(),
    vaultname,
    notes: [],
  }
  return [...vaults, newVault]
}

export function addNote(vaults: Vault[], vaultId: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id_vault !== vaultId) return vault
    const newNote: Note = {
      id_note: crypto.randomUUID(),
      notename: `Note ${vault.notes.length + 1}`,
      content: '',
      image_url: [],
      pin_up: false,
      position: vault.notes.length,
      color: '#ffffff',
      status: 'active',
      favorite: false,
      tags: [],
    }
    return { ...vault, notes: [...vault.notes, newNote] }
  })
}

export function updateNote(vaults: Vault[], vaultId: string, noteId: string, content: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id_vault !== vaultId) return vault
    return {
      ...vault,
      notes: vault.notes.map((n) =>
        n.id_note === noteId ? { ...n, content } : n,
      ),
    }
  })
}

export function updateNoteName(vaults: Vault[], vaultId: string, noteId: string, notename: string): Vault[] {
  return vaults.map((vault) => {
    if (vault.id_vault !== vaultId) return vault
    return {
      ...vault,
      notes: vault.notes.map((n) =>
        n.id_note === noteId ? { ...n, notename } : n,
      ),
    }
  })
}

export function updateVaultName(vaults: Vault[], vaultId: string, vaultname: string): Vault[] {
  return vaults.map((v) => (v.id_vault === vaultId ? { ...v, vaultname } : v))
}

export function deleteNotes(vaults: Vault[], vaultId: string, noteIds: string[]): Vault[] {
  return vaults.map((vault) => {
    if (vault.id_vault !== vaultId) return vault
    return { ...vault, notes: vault.notes.filter((n) => !noteIds.includes(n.id_note)) }
  })
}

export function deleteVault(vaults: Vault[], vaultId: string): Vault[] {
  return vaults.filter((v) => v.id_vault !== vaultId)
}

export function addTag(tags: Tag[], tagname: string, color?: string): Tag[] {
  return [...tags, { id_tag: crypto.randomUUID(), tagname, color: color ?? '#6366f1' }]
}

export function removeTag(vaults: Vault[], tags: Tag[], tagId: string): { vaults: Vault[]; tags: Tag[] } {
  return {
    tags: tags.filter((t) => t.id_tag !== tagId),
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
    if (vault.id_vault !== vaultId) return vault
    return {
      ...vault,
      notes: vault.notes.map((n) => {
        if (n.id_note !== noteId) return n
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
    const existing = resolved.find((t) => t.tagname === name)
    if (existing) {
      tagNameToId[name] = existing.id_tag
    } else {
      const id = crypto.randomUUID()
      tagNameToId[name] = id
      resolved.push({ id_tag: id, tagname: name, color: '#6366f1' })
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
    id_vault: vaultId,
    vaultname: data.title,
    notes: data.notes.map((n) => ({
      id_note: crypto.randomUUID(),
      notename: n.title,
      content: n.description,
      image_url: [],
      pin_up: false,
      position: 0,
      color: '#ffffff',
      status: 'active',
      favorite: false,
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
    id_note: crypto.randomUUID(),
    notename: n.title,
    content: n.description,
    image_url: [],
    pin_up: false,
    position: 0,
    color: '#ffffff',
    status: 'active',
    favorite: false,
    tags: n.tags.map((t) => tagNameToId[t]),
  }))

  return {
    tags: resolved,
    vaults: vaults.map((v) =>
      v.id_vault === vaultId ? { ...v, notes: [...v.notes, ...newNotes] } : v,
    ),
  }
}
