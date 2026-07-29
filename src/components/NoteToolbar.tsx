type Props = {
  onAddNote: () => void
  selectedCount: number
  onDeleteSelected: () => void
  onExportSelected: () => void
}

export function NoteToolbar({
  onAddNote, selectedCount, onDeleteSelected, onExportSelected,
}: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <button onClick={onAddNote} className="btn-primary">
        Create Generic Note
      </button>
      {selectedCount > 0 && (
        <>
          <button onClick={onDeleteSelected} className="btn-danger">
            Delete Selected ({selectedCount})
          </button>
          <button onClick={onExportSelected} className="btn-primary">
            Export
          </button>
        </>
      )}
    </div>
  )
}
