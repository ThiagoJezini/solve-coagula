import type { MouseEvent } from 'react'
import { useRef, useEffect } from 'react'

interface DragState {
  dragging: boolean
  startX: number
  startY: number
  origLeft: number
  origTop: number
}

export function useDraggable() {
  const stateRef = useRef<DragState>({
    dragging: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
  })

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      const s = stateRef.current
      if (!s.dragging) return
      const dx = e.clientX - s.startX
      const dy = e.clientY - s.startY
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const target = el?.closest<HTMLElement>('[data-dragging]')
      if (!target) return
      target.style.left = `${s.origLeft + dx}px`
      target.style.top = `${s.origTop + dy}px`
    }
    const onUp = () => {
      const s = stateRef.current
      if (s.dragging) {
        s.dragging = false
        document.body.style.userSelect = ''
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.userSelect = ''
    }
  }, [])

  const onMouseDown = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (target.closest('button, input, textarea, select, a, [role="button"]')) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    stateRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
    }
    el.style.position = 'fixed'
    el.style.left = `${rect.left}px`
    el.style.top = `${rect.top}px`
    el.style.right = 'auto'
    el.style.margin = '0'
    el.dataset.dragging = '1'
    document.body.style.userSelect = 'none'
    e.preventDefault()
  }

  const dragProps = {
    onMouseDown,
    style: { cursor: 'grab' } as const,
  }

  return dragProps
}
