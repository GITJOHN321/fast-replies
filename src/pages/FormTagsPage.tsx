import { useState } from 'react'
import { useVaults } from '../context/VaultContext'
import type { Tag } from '../domain/entities'

function TagsPage() {
  const { tags, addTag, removeTag } = useVaults()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const name = input.trim()
    if (!name) return
    addTag(name)
    setInput('')
  }

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-md">
        <h1 className="page-title">Tags</h1>

        <div className="form-card space-y-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="New tag name"
              className="input-field flex-1"
              autoFocus
            />
            <button onClick={handleAdd} className="btn-primary !w-auto px-4">
              Add
            </button>
          </div>

          {tags.length === 0 && (
            <p className="text-text-dim text-sm">No tags yet.</p>
          )}

          {tags.length > 0 && (
            <div className="space-y-1">
              {tags.map((tag: Tag) => (
                <div
                  key={tag.id_tag}
                  className="flex items-center justify-between px-3 py-2 bg-surface border border-border rounded-md"
                >
                  <span className="text-text text-sm">{tag.tagname}</span>
                  <button
                    onClick={() => { if (window.confirm(`Delete tag "${tag.tagname}"?`)) removeTag(tag.id_tag) }}
                    className="text-text-dim hover:text-red-400 text-xs transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TagsPage
