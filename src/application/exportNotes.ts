import type { Note, Vault, Tag } from '../domain/entities'

export function exportSelectedNotes(
  notes: Note[],
  vault: Vault,
  tags: Tag[],
): void {
  const tagMap = new Map(tags.map((t) => [t.id_tag, t.tagname]))

  const payload = {
    exportedAt: new Date().toISOString(),
    vault: {
      id: vault.id_vault,
      title: vault.vaultname,
    },
    notes: notes.map((n) => ({
      id: n.id_note,
      title: n.notename,
      description: n.content,
      tags: n.tags.map((tid) => tagMap.get(tid) ?? tid),
    })),
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${vault.vaultname.replace(/\s+/g, '-')}-export-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
