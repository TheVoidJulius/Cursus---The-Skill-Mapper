import React, { useRef, useEffect } from 'react'
import { PROGRESS_STAGES } from '../utils/constants'
import styles from './SkillNode.module.css'

// ─── SkillNode ────────────────────────────────────────────────────────────────
// A single draggable skill card on the canvas.
//
// Props:
//   node         — { id, label, x, y, progressIdx, color, editing }
//   selected     — boolean
//   onMouseDown  — start drag (fired in SELECT mode)
//   onClick      — handled by parent (varies by mode)
//   onDoubleClick — enter edit mode
//   onCycleProgress — advance progress stage
//   onCommitLabel — save renamed label

export default function SkillNode({
  node,
  selected,
  onMouseDown,
  onClick,
  onDoubleClick,
  onCycleProgress,
  onCommitLabel,
}) {
  const { id, label, x, y, progressIdx, color, editing } = node
  const stage = PROGRESS_STAGES[progressIdx]
  const inputRef = useRef(null)

  // Auto-focus the inline input when editing mode starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') onCommitLabel(id, e.target.value)
    if (e.key === 'Escape') onCommitLabel(id, label) // revert
  }

  return (
    <div
      className={`${styles.node} ${selected ? styles.selected : ''}`}
      style={{
        left: x,
        top: y,
        borderLeft: `3px solid ${color}`,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Progress stage label + color dot */}
      <div className={styles.stageLine}>
        <span className={styles.dot} style={{ background: color }} />
        <span className={styles.stageLabel}>{stage.label}</span>
      </div>

      {/* Skill label or inline edit input */}
      {editing ? (
        <input
          ref={inputRef}
          className={styles.editInput}
          defaultValue={label}
          onBlur={e => onCommitLabel(id, e.target.value)}
          onKeyDown={handleInputKeyDown}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <div className={styles.label}>{label}</div>
      )}

      {/* Progress bar — click anywhere on the bar to advance */}
      <div
        className={styles.progressTrack}
        title={`Click to advance — ${stage.label} (${stage.pct}%)`}
        onClick={e => { e.stopPropagation(); onCycleProgress(id) }}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${stage.pct}%`, background: stage.color }}
        />
      </div>

      <div className={styles.progressFooter}>
        <span>Progress</span>
        <span>{stage.pct}%</span>
      </div>
    </div>
  )
}
