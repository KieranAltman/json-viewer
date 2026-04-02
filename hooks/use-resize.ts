"use client"

import { useCallback, useRef, useState } from "react"

export function useResize() {
  const [leftWidth, setLeftWidth] = useState(50)
  const containerRef = useRef<HTMLElement | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement
    if (!container) return
    containerRef.current = container

    const onMove = (moveEvent: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return
      const pct = ((moveEvent.clientX - rect.left) / rect.width) * 100
      setLeftWidth(Math.min(80, Math.max(20, pct)))
    }

    const onUp = () => {
      containerRef.current = null
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }

    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }, [])

  return { leftWidth, onMouseDown }
}
