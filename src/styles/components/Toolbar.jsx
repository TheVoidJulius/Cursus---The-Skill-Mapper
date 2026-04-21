import React from 'react'
import { MODE } from '../hooks/useSkillMap'
import styles from './Toolbar.module.css'

// ─── Toolbar ─────────────────────────────────────────────────────────────────
// All top-level actions live here. To add a new button:
//   1. Add a <ToolBtn> or plain <button> below
//   2. Wire up the handler in App.jsx and pass it as a prop
export default function Toolbar({ mode, onChangeMode, onAddNode, onLoadTemplate, onShare }) {
  return (
    <div className={styles.toolbar}>
      <span className={styles.logo}>SkillMap</span>
      <Divider />

      {/* Primary action */}
      <button className={`${styles.btn} ${styles.primary}`} onClick={onAddNode}>
        + Add skill
      </button>
      <Divider />

      {/* Mode buttons */}
      <ToolBtn
        id="sel"
        label="↖ Select"
        active={mode === MODE.SELECT}
        variant="info"
        onClick={() => onChangeMode(MODE.SELECT)}
      />
      <ToolBtn
        id="con"
        label="→ Connect"
        active={mode === MODE.CONNECT}
        variant="info"
        onClick={() => onChangeMode(MODE.CONNECT)}
      />
      <ToolBtn
        id="del"
        label="✕ Delete"
        active={mode === MODE.DELETE}
        variant="danger"
        onClick={() => onChangeMode(MODE.DELETE)}
      />
      <Divider />

      {/* Utilities */}
      <button className={styles.btn} onClick={onLoadTemplate}>Load template</button>
      <button className={styles.btn} onClick={onShare}>🔗 Share link</button>
    </div>
  )
}

function ToolBtn({ label, active, variant, onClick }) {
  const cls = [styles.btn, active ? styles[variant] : ''].filter(Boolean).join(' ')
  return <button className={cls} onClick={onClick}>{label}</button>
}

function Divider() {
  return <span className={styles.divider} />
}
