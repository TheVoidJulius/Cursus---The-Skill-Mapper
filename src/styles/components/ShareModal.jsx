import React, { useRef, useEffect, useState } from 'react'
import styles from './ShareModal.module.css'

// ─── ShareModal ───────────────────────────────────────────────────────────────
// Modal overlay that shows the shareable URL.
// Props:
//   url      — the full share URL string
//   onClose  — close handler

export default function ShareModal({ url, onClose }) {
  const inputRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Select the URL text when the modal opens
    if (inputRef.current) {
      inputRef.current.select()
    }
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Share roadmap">
        <div className={styles.header}>
          <h2 className={styles.title}>Share your roadmap</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>

        <p className={styles.desc}>
          Your full roadmap is encoded in this URL — no account or backend needed.
          Anyone with the link can view and continue editing it.
        </p>

        <div className={styles.row}>
          <input
            ref={inputRef}
            className={styles.urlInput}
            value={url}
            readOnly
            onClick={e => e.target.select()}
          />
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeFooterBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
