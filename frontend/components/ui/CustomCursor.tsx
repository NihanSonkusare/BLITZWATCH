'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const pos = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isInput, setIsInput] = useState(false)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouse = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      const target = e.target as Element
      const isClickable = target.closest('a, button, [role="button"], label, select, [data-cursor="pointer"]')
      const isTextInput = target.closest('input, textarea, [contenteditable]')

      setIsPointer(!!isClickable)
      setIsInput(!!isTextInput)
    }

    const handleLeave = () => setIsVisible(false)
    const handleEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', handleMouse)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    // Spring-physics animation loop
    let animId: number
    const stiffness = 150
    const damping = 15

    const animate = () => {
      const dx = pos.current.x - current.current.x
      const dy = pos.current.y - current.current.y

      current.current.x += dx / (damping / stiffness * 10 + 1) * 0.2 + dx * 0.04
      current.current.y += dy / (damping / stiffness * 10 + 1) * 0.2 + dy * 0.04

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
      }
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouse)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      cancelAnimationFrame(animId)
    }
  }, [isVisible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="transition-all duration-150"
          style={{
            width: isInput ? '6px' : isPointer ? '40px' : '28px',
            height: isInput ? '6px' : isPointer ? '40px' : '28px',
            borderRadius: '50%',
            border: isInput ? 'none' : `2px solid rgba(232, 255, 71, ${isPointer ? 1 : 0.7})`,
            backgroundColor: isInput ? 'rgba(232, 255, 71, 0.9)' : isPointer ? 'rgba(232, 255, 71, 0.1)' : 'transparent',
            boxShadow: `0 0 ${isPointer ? '20px' : '10px'} rgba(232, 255, 71, 0.3)`,
          }}
        />
      </div>
      {/* Precise dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ opacity: isVisible && !isInput ? 1 : 0 }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#E8FF47]"
        />
      </div>
    </>
  )
}
