import { useRef, useEffect, useCallback } from 'react'

export function useDoubleClick(
  onSingle: () => void,
  onDouble: () => void,
  delay = 200
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSingleRef = useRef(onSingle)
  const onDoubleRef = useRef(onDouble)

  onSingleRef.current = onSingle
  onDoubleRef.current = onDouble

  const click = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      onDoubleRef.current()
      return
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      onSingleRef.current()
    }, delay)
  }, [delay])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { click }
}
