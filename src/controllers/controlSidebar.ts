import { useEffect, useRef } from 'react'

type Setter = (v: boolean) => void
type Ref<T extends HTMLElement> = React.RefObject<T | null>

function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
  deps: unknown[]
) {
  useEffect(() => {
    document.addEventListener(event, handler)
    return () => document.removeEventListener(event, handler)
  }, deps)
}

export function useHeldKeysSidebar(open: boolean, setOpen: Setter) {
  const heldKeys = useRef<Set<string>>(new Set())

  useEventListener('keydown', (e) => {
    heldKeys.current.add(e.key)
    if (heldKeys.current.has(' ') && heldKeys.current.has('ArrowLeft')) {
      e.preventDefault()
      if (!open) setOpen(true)
    }
  }, [open, setOpen])

  useEventListener('keyup', (e) => {
    heldKeys.current.delete(e.key)
  }, [])
}

export function useNavKeyboard(
  open: boolean,
  setOpen: Setter,
  focusedIdx: number,
  setFocusedIdx: (fn: (prev: number) => number) => void,
  ref: Ref<HTMLElement>
) {
  useEffect(() => {
    if (focusedIdx < 0 || !ref.current) return
    const links = ref.current.querySelectorAll('a')
    if (focusedIdx >= links.length) return
    links[focusedIdx].scrollIntoView({ block: 'nearest' })
  }, [focusedIdx, ref])

  useEventListener('keydown', (e) => {
    if (!open) return

    const links = ref.current ? Array.from(ref.current.querySelectorAll('a')) : []
    if (links.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx((prev) => (prev + 1) % links.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx((prev) => (prev - 1 + links.length) % links.length)
    } else if (e.key === 'Enter' && focusedIdx >= 0 && focusedIdx < links.length) {
      links[focusedIdx].click()
      setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [open, setOpen, focusedIdx, setFocusedIdx, ref])
}
