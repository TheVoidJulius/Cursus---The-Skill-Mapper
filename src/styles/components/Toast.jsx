import React, { useEffect, useState } from 'react'
import styles from './Toast.module.css'

// ─── Toast ────────────────────────────────────────────────────────────────────
// Lightweight status notification shown at the bottom of the canvas.
// Props:
//   message  — string or null (null = hidden)
//   duration — auto-dismiss ms (default 2500)
//   onDone   — called when the toast finishes showing

export default function Toast({ message, duration = 2500, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      if (onDone) onDone()
    }, duration)
    return () => clearTimeout(t)
  }, [message, duration, onDone])

  if (!message) return null

  return (
    <div className={`${styles.toast} ${visible ? styles.show : styles.hide}`}>
      {message}
    </div>
  )
}
