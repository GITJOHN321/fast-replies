import { useState, useRef, useEffect, useMemo } from 'react'
import type { Note, Tag } from '../domain/entities'
import { useAutoResize } from '../hooks/useAutoResize'
import { useDoubleClick } from '../hooks/useDoubleClick'
import { useCopyButton } from '../hooks/useCopyButton'

type Props = {
  note: Note
  tags?: Tag[]
  expanded: boolean
  selected?: boolean
  focused?: boolean
  editingTitleFromNav?: boolean
  onToggle: (id: string) => void
  onSelectChange?: (id: string, selected: boolean) => void
  onDescriptionChange: (id: string, description: string) => void
  onTitleChange?: (noteId: string, title: string) => void
  onToggleTag?: (noteId: string, tagId: string) => void
}

export function NoteAccordion({ note, tags = [], expanded, selected, focused, editingTitleFromNav, onToggle, onSelectChange, onDescriptionChange, onTitleChange, onToggleTag }: Props) {
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editValue, setEditValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const { resize } = useAutoResize(textareaRef)
  const { copied, copy } = useCopyButton()
  const { click: handleDblClick } = useDoubleClick(
    () => onToggle(note.id),
    () => { setEditValue(note.title); setEditingTitle(true) }
  )

  const noteTagObjects = useMemo(
    () => tags.filter((t) => note.tags.includes(t.id)),
    [tags, note.tags]
  )

  useEffect(() => {
    resize()
  }, [note.description, expanded, resize])

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  useEffect(() => {
    if (expanded && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [expanded])

  useEffect(() => {
    if (editingTitleFromNav) {
      setEditValue(note.title)
      setEditingTitle(true)
    }
  }, [editingTitleFromNav, note.title])

  const focusTextarea = () => {
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const commitTitle = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== note.title && onTitleChange) {
      onTitleChange(note.id, trimmed)
    }
    setEditingTitle(false)
    focusTextarea()
  }

  const handleHeaderClick = () => {
    if (editingTitle) return
    if (!expanded) {
      onToggle(note.id)
      return
    }
    handleDblClick()
  }

  const handleCopy = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    copy(note.description)
  }

  const handleCopyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      copy(note.description)
    }
  }

  return (
    <div className={`border rounded-md overflow-hidden ${focused ? 'accordion-focus-ring' : 'border-border'}`}>
      <button
        onClick={handleHeaderClick}
        className="accordion-header rounded-none border-0"
      >
        {onSelectChange && (
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => onSelectChange(note.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 accent-accent cursor-pointer"
          />
        )}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') commitTitle()
                if (e.key === 'Escape') { setEditingTitle(false); focusTextarea() }
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 bg-transparent text-text outline-none border-b border-accent text-center"
            />
          ) : (
            <span className="truncate text-center w-full">{note.title}</span>
          )}
        </div>
        <span className="relative shrink-0">
          <span
            onClick={handleCopy}
            onKeyDown={handleCopyKeyDown}
            role="button"
            tabIndex={0}
            className="absolute right-full mr-1 text-text-dim hover:text-text transition-colors cursor-pointer"
            title="Copy description"
          >
            {copied ? (
              '✓'
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </span>
          <span className="text-text-dim text-xs">{expanded ? '▲' : '▼'}</span>
        </span>
      </button>

      <div className="px-4 py-2 flex gap-1.5 flex-wrap">
        {noteTagObjects.map((t) => (
          <span
            key={t.id}
            className="tag-badge"
          >
            {t.name}
          </span>
        ))}
      </div>

      <div
        className={`transition-all duration-300 grid ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          {expanded && onToggleTag && (
            <div className="px-4 pt-3 pb-2 border-t border-border">
              <button
                onClick={() => setShowTagPicker(!showTagPicker)}
                className="text-xs text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                {showTagPicker ? 'Close tags' : `Tags (${note.tags.length})`}
              </button>

              {showTagPicker && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((t) => {
                    const active = note.tags.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => onToggleTag(note.id, t.id)}
                        className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                          active
                            ? 'bg-accent/20 border-accent text-accent'
                            : 'bg-card border-border text-text-dim hover:text-text'
                        }`}
                      >
                        {t.name}
                      </button>
                    )
                  })}
                  {tags.length === 0 && (
                    <span className="text-xs text-text-dim">No tags available</span>
                  )}
                </div>
              )}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={note.description}
            onChange={(e) => {
              onDescriptionChange(note.id, e.target.value)
              resize()
            }}
            onPaste={() => setTimeout(resize, 0)}
            placeholder="Write a description..."
            rows={1}
            className="w-full px-4 py-3 bg-surface text-text placeholder-text-dim resize-none border-t border-border focus:outline-none overflow-y-auto vaults-scroll"
          />
        </div>
      </div>
    </div>
  )
}
