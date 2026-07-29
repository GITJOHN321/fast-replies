import { useState, useEffect } from 'react'

export function useAppMode() {
  const [mode, setMode] = useState<'dark' | 'white'>(
    () => (localStorage.getItem('app-mode') as 'dark' | 'white') || 'dark',
  )
  useEffect(() => {
    document.documentElement.dataset.mode = mode
    localStorage.setItem('app-mode', mode)
  }, [mode])
  return [mode, setMode] as const
}
