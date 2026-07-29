import type { Note, Vault, Tag } from '../domain/entities'

export function exportSelectedNotes(
  notes: Note[],
  vault: Vault,
  tags: Tag[],
): void {
  const tagMap = new Map(tags.map((t) => [t.id, t.name]))

  const payload = {
    exportedAt: new Date().toISOString(),
    vault: {
      id: vault.id,
      title: vault.title,
    },
    notes: notes.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      tags: n.tags.map((tid) => tagMap.get(tid) ?? tid),
    })),
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${vault.title.replace(/\s+/g, '-')}-export-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
