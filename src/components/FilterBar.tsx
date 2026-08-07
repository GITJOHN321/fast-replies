import { type RefObject } from 'react'
import type { Tag } from '../domain/entities'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  tags: Tag[]
  filterTags: string[]
  onToggleTag: (tagId: string) => void
  noteCount: number
  selectedCount: number
  onSelectAll: () => void
  searchRef: RefObject<HTMLInputElement | null>
}

export function FilterBar({
  search, onSearchChange, tags, filterTags, onToggleTag,
  noteCount, selectedCount, onSelectAll, searchRef,
}: Props) {
  const allSelected = noteCount > 0 && selectedCount === noteCount

  return (
    <>
      <input
        ref={searchRef}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by title or description..."
        className="input-field"
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => {
            const active = filterTags.includes(t.id_tag)
            return (
              <button
                key={t.id_tag}
                onClick={() => onToggleTag(t.id_tag)}
                className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                  active
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-card border-border text-text-dim hover:text-text'
                }`}
              >
                {t.tagname}
              </button>
            )
          })}
        </div>
      )}
      {noteCount > 0 && (
        <label className="flex items-center gap-2 text-sm text-text-dim cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="accent-accent cursor-pointer"
          />
          {allSelected ? 'Deselect All' : 'Select All'}
        </label>
      )}
    </>
  )
}
