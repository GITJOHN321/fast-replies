type Props = {
  mode: 'dark' | 'white'
  onModeChange: (mode: 'dark' | 'white') => void
}

export function AppearanceSettings({ mode, onModeChange }: Props) {
  return (
    <div className="form-card space-y-3">
      <h2 className="text-sm font-semibold text-text tracking-wide uppercase">
        Appearance
      </h2>
      <p className="text-xs text-text-dim">
        Customize the look and feel of the app.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange('dark')}
          className={`flex-1 px-3 py-2 text-sm rounded-md border cursor-pointer transition-colors ${
            mode === 'dark'
              ? 'border-accent bg-accent/10 text-text'
              : 'border-border bg-surface text-text-dim hover:text-text'
          }`}
        >
          Dark
        </button>
        <button
          onClick={() => onModeChange('white')}
          className={`flex-1 px-3 py-2 text-sm rounded-md border cursor-pointer transition-colors ${
            mode === 'white'
              ? 'border-accent bg-accent/10 text-text'
              : 'border-border bg-surface text-text-dim hover:text-text'
          }`}
        >
          White
        </button>
      </div>
    </div>
  )
}
