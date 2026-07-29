import { useCallback, type RefObject } from 'react'

export function useAutoResize(
  ref: RefObject<HTMLTextAreaElement | null>,
  maxLines = 20
) {
  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const cs = getComputedStyle(el)
    const lineHeight = parseFloat(cs.lineHeight)
    const vPadding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    const maxHeight = Math.round(lineHeight * maxLines + vPadding)
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
  }, [ref, maxLines])

  return { resize }
}
