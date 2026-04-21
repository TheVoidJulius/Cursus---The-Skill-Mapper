import React from 'react'
import { MODE } from '../hooks/useSkillMap'
import styles from './StatusBar.module.css'

// ─── StatusBar ────────────────────────────────────────────────────────────────
// Bottom strip showing live stats and contextual hints per mode.
export default function StatusBar({ stats, mode, connectSrc }) {
  const hint = {
    [MODE.SELECT]:  'Drag to move · double-click to rename · click progress bar to advance',
    [MODE.CONNECT]: connectSrc
      ? 'Now click a destination skill to create the connection'
      : 'Click the source skill first, then the destination',
    [MODE.DELETE]:  'Click a skill or the ✕ on an arrow to delete it',
  }[mode]

  return (
    <div className={styles.bar}>
      <Stat label="Skills"    value={stats.nodeCount} />
      <Stat label="Links"     value={stats.edgeCount} />
      <Stat label="Mastered"  value={stats.masteredCount} />
      <Stat
        label="Progress"
        value={stats.avgProgress !== null ? `${stats.avgProgress}%` : '—'}
      />
      <span className={styles.hint}>{hint}</span>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <span className={styles.stat}>
      {label}: <strong>{value}</strong>
    </span>
  )
}
