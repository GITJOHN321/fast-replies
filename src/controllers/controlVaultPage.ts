import { useEffect } from 'react'
import type { Note } from '../domain/entities'

export function useVaultKeyboardNav(
  focusedNavId: string | null,
  setFocusedNavId: (id: string | null) => void,
  setExpandedId: (id: string | null) => void,
  filtered: Note[],
  sidebarOpen: boolean,
  onActivateEdit: (noteId: string) => void,
  onAddNote: () => void,
  onFocusSearch: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sidebarOpen) return

      const tag = document.activeElement?.tagName
      const isInputFocused = tag === 'INPUT' || tag === 'TEXTAREA'

      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !isInputFocused) {
        e.preventDefault()
        if (focusedNavId === null && filtered.length > 0) {
          setExpandedId(filtered[0].id)
          setFocusedNavId(filtered[0].id)
        }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !isInputFocused) {
        e.preventDefault()
        onFocusSearch()
        return
      }

      if (e.key === '+' && !isInputFocused) {
        e.preventDefault()
        onAddNote()
        return
      }

      if (focusedNavId === null) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const idx = filtered.findIndex((n) => n.id_note === focusedNavId)
        if (idx < filtered.length - 1) {
          const nextId = filtered[idx + 1].id
          setExpandedId(nextId)
          setFocusedNavId(nextId)
        }
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const idx = filtered.findIndex((n) => n.id_note === focusedNavId)
        if (idx > 0) {
          const prevId = filtered[idx - 1].id
          setExpandedId(prevId)
          setFocusedNavId(prevId)
        }
        return
      }

      if (e.key === 'Escape') {
        setFocusedNavId(null)
        setExpandedId(null)
        ;(document.activeElement as HTMLElement)?.blur()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const note = filtered.find((n) => n.id_note === focusedNavId)
        if (note?.content) {
          e.preventDefault()
          navigator.clipboard.writeText(note.content)
        }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault()
        onActivateEdit(focusedNavId)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen, focusedNavId, filtered, setFocusedNavId, setExpandedId, onActivateEdit, onAddNote, onFocusSearch])
}
